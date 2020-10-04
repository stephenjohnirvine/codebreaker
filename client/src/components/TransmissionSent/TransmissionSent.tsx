import React from 'react';
import { Code, Transmission } from '../../types/gameState';

type TransmissionSentProps = {
  code: Code;
  transmission: Transmission;
};

export const TransmissionSent = ({
  code,
  transmission,
}: TransmissionSentProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>Sent Transmission:</td>
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
              <input disabled value={transmission[0]} />
            </td>
            <td>
              <input disabled value={transmission[1]} />
            </td>
            <td>
              <input disabled value={transmission[2]} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
