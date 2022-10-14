import { useEffect, useState } from "react";
import audio from "./assets/beep-6-96243.mp3";
import { Minus, Plus } from "./assets/images";
const App = () => {
  const initialBreakLength = 300;
  const initialSessionLength = 1500;
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [breakLength, setBreakLength] = useState(initialBreakLength);
  const [sessionLength, setSessionLength] = useState(initialSessionLength);
  const [timer, setTimer] = useState(null);
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [sessionType, setSessionType] = useState("session");
  const sound = document.getElementById("beep");

  let hasStarted = timerIntervalId !== null; // check timer state
  function secondsToTime(seconds) {
    return [Math.floor(seconds / 60), seconds % 60];
  }

  function toggleCountDown() {
    if (hasStarted) {
      // started mode
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
      setTimerIntervalId(null);
    } else {
      const newIntervalId = setInterval(() => {
        setTimer(prevTime => {
          let newTime = prevTime - 1;
          let time = secondsToTime(newTime);
          setMinutes(time[0]);
          setSeconds(time[1]);
          return newTime;
        });
      }, 1000);
      setTimerIntervalId(newIntervalId);
    }
  }

  const restToInitial = () => {
    clearInterval(timerIntervalId);
    setTimerIntervalId(null);
    setSeconds(0);
    setMinutes(25);
    setBreakLength(initialBreakLength);
    setSessionLength(initialSessionLength);
    setTimer(1500);
    setSessionType("session");
    hasStarted = null;

    sound.pause();
    sound.currentTime = 0;
  };

  useEffect(
    () => {
      if (timer === 0) {
        sound.play();
        if (sessionType === "session") {
          setSessionType("break");
          setTimer(breakLength + 1); // add one more to the breakLength to make the timer show the correct value          ;
        } else if (sessionType === "break") {
          setSessionType("session");
          setTimer(sessionLength + 1); // add one more to the breakLength to make the timer show the correct value
        }
      }
    },
    [timer]
  );

  useEffect(
    () => {
      if (timer !== 0 && sessionType === "break") {
        setMinutes(secondsToTime(breakLength)[0]);
        setSeconds(secondsToTime(breakLength)[1]);
        setTimer(breakLength);
      } else if (timer !== 0 && sessionType === "session") {
        setMinutes(secondsToTime(sessionLength)[0]);
        setSeconds(secondsToTime(sessionLength)[1]);
        setTimer(sessionLength);
      }
    },
    [breakLength, sessionLength]
  );

  return (
    <main className="timer">
      <section className="timer__counter counter">
        <span className="counter__label" id="timer-label">
          {sessionType}
        </span>

        <div className="counter__circle counter-circle ">
          <div className="counter-circle__main" />
          <div className="counter-circle__cover   counter-circle__cover--first active" />
          <div className="counter-circle__cover  counter-circle__cover--second active" />
          <div className="counter-circle__cover counter-circle__cover--third active" />
          <div className="counter-circle__cover counter-circle__cover--fourth active" />
          <div className="counter-circle__cover counter-circle__cover--first-cover active" />
          <div className="counter-circle__cover  counter-circle__cover--second-cover active" />
        </div>

        <div className="counter__time-left" id="time-left">
          {/* format the timer value being displayed */}
          {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
        <div className="counter__parameters">
          <section className="counter-parameter">
            <span className="counter-parameter__label" id="session-label">
              Session Length
            </span>
            <span className="counter-parameter__value" id="session-length">
              {secondsToTime(sessionLength)[0]}
            </span>
          </section>

          <section className="counter-parameter">
            <span className="counter-parameter__label" id="break-label">
              Break Length
            </span>
            <span id="break-length" className="counter-parameter__value">
              {secondsToTime(breakLength)[0]}
            </span>
          </section>
        </div>
      </section>

      <section className="timer__buttons timer-buttons">
        <button
          className="timer-buttons__button timer-buttons__session-increment"
          id="session-increment"
          onClick={() => {
            hasStarted ||
              (sessionLength < 3600 && setSessionLength(sessionLength + 60));
          }}
        >
          Session 
          <Plus/>

        </button>
        <button
          className="timer-buttons__button timer-buttons__session-decrement"
          id="session-decrement"
          onClick={() => {
            hasStarted ||
              (sessionLength > 60 && setSessionLength(sessionLength - 60));
          }}
        >
          Session

          <Minus/>
        </button>

        <button
          className="timer-buttons__button timer-buttons__break-increment"
          id="break-increment"
          onClick={() => {
            hasStarted ||
              (breakLength < 3600 && setBreakLength(breakLength + 60));
          }}
        >
          Break 
          <Plus/>
        </button>
        <button
          className="timer-buttons__button timer-buttons__break-decrement"
          id="break-decrement"
          onClick={() => {
            hasStarted ||
              (breakLength > 60 && setBreakLength(breakLength - 60));
          }}
        >
           Break
          <Minus/>



        </button>

        <button
          className="timer-buttons__button timer-buttons__reset"
          id="reset"
          onClick={restToInitial}
        >
          Reset
        </button>
        <button
          className="timer-buttons__button timer-buttons__start-stop"
          id="start_stop"
          onClick={toggleCountDown}
        >
          {hasStarted ? "Stop" : "Start"}
        </button>
      </section>
      <audio src={audio} id="beep" />

      {/* <button onClick={() => {
        let elem = document.querySelectorAll(".counter-circle__cover")
        // elem.forEach((item) => {
          // item.classList.toggle("active")
         
          // item.style.transition = 'transform'


        // })
        console.log(elem)
    



      }}>toggle</button> */}
    </main>
  );
};

export default App;
  