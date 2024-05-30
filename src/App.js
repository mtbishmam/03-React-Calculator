import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./styles.css";
import { findByAltText } from "@testing-library/react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
  CLEAR: "clear",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "." && state.cur.includes(".")) return state;
      if (state.cur === "0") {
        if (payload.digit === "0") return state;
        else return { ...state, cur: payload.digit };
      }
      return { ...state, cur: `${state.cur || ""}${payload.digit}` };

    case ACTIONS.DELETE_DIGIT:
      if (state.cur && state.cur.length) {
        return { ...state, cur: state.cur.slice(0, -1) };
      } else {
        if (state.op) return { ...state, op: null };
        else if (state.prev && state.prev.length)
          return { ...state, prev: state.prev.slice(0, -1) };
        else return state;
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.cur == null) {
        if (state.op) return { ...state, op: payload.operation };
        else return state;
      } else {
        if (state.prev == null)
          return {
            ...state,
            prev: state.cur,
            cur: null,
            op: payload.operation,
          };
        else {
          if (state.op == null) return { ...state, op: payload.operation };
          else
            return {
              ...state,
              prev: evaluate(state),
              cur: null,
              op: payload.operation,
            };
        }
      }

    case ACTIONS.EVALUATE:
      if (state.cur == null || state.prev == null || state.op == null)
        return state;
      return { ...state, cur: evaluate(state), prev: null, op: null };

    case ACTIONS.CLEAR:
      return {};

    default:
      return state;
  }
}

function evaluate({ cur, prev, op }) {
  let result = 0;
  let c = parseFloat(cur);
  let p = parseFloat(prev);
  if (op === "÷") result = p / c;
  if (op === "*") result = p * c;
  if (op === "+") result = p + c;
  if (op === "-") result = p - c;
  return result.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatter(operand) {
  if (operand == null) return operand;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return `${INTEGER_FORMATTER.format(integer)}`;
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

export default function App() {
  const [{ cur, prev, op }, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatter(prev)} {op}
        </div>
        <div className="current-operand">{formatter(cur)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton
        operation="÷"
        dispatch={dispatch}
      />
      <DigitButton
        digit="1"
        dispatch={dispatch}
      />
      <DigitButton
        digit="2"
        dispatch={dispatch}
      />
      <DigitButton
        digit="3"
        dispatch={dispatch}
      />
      <OperationButton
        operation="*"
        dispatch={dispatch}
      />
      <DigitButton
        digit="4"
        dispatch={dispatch}
      />
      <DigitButton
        digit="5"
        dispatch={dispatch}
      />
      <DigitButton
        digit="6"
        dispatch={dispatch}
      />
      <OperationButton
        operation="+"
        dispatch={dispatch}
      />
      <DigitButton
        digit="7"
        dispatch={dispatch}
      />
      <DigitButton
        digit="8"
        dispatch={dispatch}
      />
      <DigitButton
        digit="9"
        dispatch={dispatch}
      />
      <OperationButton
        operation="-"
        dispatch={dispatch}
      />
      <DigitButton
        digit="."
        dispatch={dispatch}
      />
      <DigitButton
        digit="0"
        dispatch={dispatch}
      />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
