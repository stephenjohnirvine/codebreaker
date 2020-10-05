import React, { useState } from 'react';
import { Code, Transmission } from '../../types/gameState';
import './CreateTransmission.css';

export type CreateTransmissionProps = {
  code: Code;
  onSend: (transmission: Transmission) => void;
};

export const CreateTransmission = ({
  code,
  onSend,
}: CreateTransmissionProps) => {
  const [code0, setCode0] = useState('');
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');

  type ArrRow = {
    code: number;
    setter: typeof setCode0;
  };
  const asArray: ArrRow[] = [
    { code: code[0], setter: setCode0 },
    { code: code[1], setter: setCode1 },
    { code: code[2], setter: setCode2 },
  ];

  const validEncodings = code0 !== '' && code1 !== '' && code2 !== '';

  return (
    <div className="transmission">
      <div className="title row">
        Code:<div className="code">{code.join(' ')}</div>
      </div>

      <div className="rows">
        {asArray.map(({ code, setter }: ArrRow, index: number) => (
          <div className="row" key={index}>
            <div className="codeDigit">{code}</div>
            <input
              className="digitEncoding"
              onChange={(event) => setter(event.target.value)}
            ></input>
          </div>
        ))}
      </div>

      <div className="row">
        <button
          className="button"
          id="send"
          onClick={() => onSend([code0, code1, code2])}
          disabled={!validEncodings}
        >
          Transmit
        </button>
      </div>
    </div>
  );
};
