import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Modal from "./component/Modal";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [valueOutput, setValueOutput] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [errorReceive, setErrorReceive] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [coinImages, setCoinImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://interview.switcheo.com/prices.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  const currencyOptions = currencies.map((currency) => ({
    value: currency.currency,
    label: (
      <div className="currency-option">
        <img
          src={`/coins/${currency.currency.toLowerCase()}.svg`}
          alt={currency.currency}
          className="currency-coin"
        />
        {currency.currency}
      </div>
    ),
  }));

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
      setError("");
      if (selectedCurrency) {
        const currency = currencies.find(
          (currency) => currency.currency === selectedCurrency
        );
        if (currency) {
          setValueOutput(currency.price * value);
        }
      }
    } else {
      setError("*Please enter a valid number");
    }
  };

  const handleAmountBlur = () => {
    if (amount === "") {
      setError("*Please enter the amount");
    } else {
      setError("");
    }
  };

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption.value);
    const currency = currencies.find(
      (currency) => currency.currency === selectedOption.value
    );
    if (currency) {
      setValueOutput(currency.price * amount);
      setErrorReceive("");
    }
  };

  const handleSwap = () => {
    if (!selectedCurrency) {
      setErrorReceive("*Please select the coin you want to convert");
    }
    if (!amount) {
      setError("*Please enter a valid number");
    }
    if (!error && selectedCurrency && amount) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const message = `You have successfully converted ${amount} VND to ${valueOutput} ${selectedCurrency}`;
        const coinImg = `/coins/${selectedCurrency.toLowerCase()}.svg`;
        const coinImagesArray = Array.from({ length: 10 }, () => ({
          src: coinImg,
          animationDelay: Math.random() * 2,
          left: Math.random() * 100,
        }));
        setModalMessage(message);
        setCoinImages(coinImagesArray);
        setShowModal(true);
      }, 2000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1>CURRENCY CONVERTER</h1>
      <form className="form">
        <div>
          <label className="label" htmlFor="input-amount">
            Amount to send {error && <span className="error">{error}</span>}
          </label>
          <div className="input-select">
            <input
              onBlur={handleAmountBlur}
              onChange={handleAmountChange}
              className={error ? "input input-error" : "input"}
              id="input-amount"
              value={amount}
            />
          </div>
        </div>

        <ArrowForwardIcon fontSize="large" className="icon" />

        <div>
          <label className="label" htmlFor="output-amount">
            Amount to receive{" "}
            {errorReceive && <span className="error">{errorReceive}</span>}
          </label>
          <div className="input-select">
            <input
              value={valueOutput}
              disabled
              className="input"
              id="output-amount"
            />
            <Select
              className="select"
              value={currencyOptions.find(
                (option) => option.value === selectedCurrency
              )}
              onChange={handleCurrencyChange}
              options={currencyOptions}
            />
          </div>
        </div>
      </form>
      <button onClick={handleSwap} className="button" disabled={isLoading}>
        {isLoading ? "Processing..." : "CONFIRM SWAP"}
      </button>

      <Modal
        show={showModal}
        onClose={closeModal}
        message={modalMessage}
        coinImages={coinImages}
      />
    </div>
  );
}

export default App;
