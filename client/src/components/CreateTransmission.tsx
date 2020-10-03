import React, { useState } from 'react';
import { Code, Transmission } from '../types/gameState';

type CreateTransmissionProps = {
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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>Code:</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{code[0]}</td>
            <td>{code[1]}</td>
            <td>{code[2]}</td>
          </tr>
          <tr>
            <td>
              <input onChange={(event) => setCode0(event.target.value)}></input>
            </td>
            <td>
              <input onChange={(event) => setCode1(event.target.value)}></input>
            </td>
            <td>
              <input onChange={(event) => setCode2(event.target.value)}></input>
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button id="send" onClick={() => onSend([code0, code1, code2])}>
                Send
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
