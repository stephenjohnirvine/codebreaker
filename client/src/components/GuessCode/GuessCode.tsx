import React, { useState } from 'react';
import { Code, Transmission } from '../../types/gameState';
import './GuessCode.css';

export type GuessCodeProps = {
  transmission: Transmission;
  onGuess: (code: Code) => void;
};

export const GuessCode = ({ transmission, onGuess }: GuessCodeProps) => {
  const [code0, setCode0] = useState<number | undefined>(undefined);
  const [code1, setCode1] = useState<number | undefined>(undefined);
  const [code2, setCode2] = useState<number | undefined>(undefined);

  const setCode = (
    setCode: typeof setCode0
  ): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
    return (event) => {
      const v = Number(event.target.value);

      if (isNaN(v)) {
        setCode(undefined);
        return;
      }

      setCode(v);
    };
  };

  type ArrRow = {
    transmission: string;
    setter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };
  const asArray: ArrRow[] = [
    { transmission: transmission[0], setter: setCode(setCode0) },
    { transmission: transmission[1], setter: setCode(setCode1) },
    { transmission: transmission[2], setter: setCode(setCode2) },
  ];

  const validInput = (input: number | undefined): boolean => {
    if (input === undefined) {
      return false;
    }

    return input > 0 && input <= 4;
  };

  const validInputs =
    validInput(code0) && validInput(code1) && validInput(code2);

  return (
    <div className="transmission">
      <div className="title row">
        Transmission:<div className="code">{transmission.join(' ')}</div>
      </div>

      <div className="rows">
        {asArray.map(({ transmission, setter }: ArrRow, index: number) => (
          <div className="row" key={index}>
            <div className="transmissionElement">{transmission}</div>
            <input className="codeEntry" onChange={setter}></input>
          </div>
        ))}
      </div>

      <div className="row">
        <button
          className="button"
          id="send"
          onClick={() => onGuess([code0, code1, code2] as Code)}
          disabled={!validInputs}
        >
          Decrypt Code
        </button>
      </div>
    </div>
  );

  /*
    <div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>Transmission:</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{transmission[0]}</td>
            <td>{transmission[1]}</td>
            <td>{transmission[2]}</td>
          </tr>
          <tr>
            <td>
              <input onChange={setCode(setCode0)}></input>
            </td>
            <td>
              <input onChange={setCode(setCode1)}></input>
            </td>
            <td>
              <input onChange={setCode(setCode2)}></input>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button
                id="send"
                disabled={!validInputs}
                onClick={() => {
                  // Button is disabled if they are not valid
                  onGuess([code0, code1, code2] as Code);
                }}
              >
                Send
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  */
};
