import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export default function Captcha({ onVerify, className = "" }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<"+" | "-" | "*">("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const generateCaptcha = () => {
    const operators: ("+" | "-" | "*")[] = ["+", "-", "*"];
    const randomOperator = operators[Math.floor(Math.random() * operators.length)];
    
    let n1, n2;
    
    // Generate appropriate numbers based on operator
    if (randomOperator === "*") {
      n1 = Math.floor(Math.random() * 10) + 1; // 1-10
      n2 = Math.floor(Math.random() * 10) + 1; // 1-10
    } else if (randomOperator === "-") {
      n1 = Math.floor(Math.random() * 20) + 10; // 10-29
      n2 = Math.floor(Math.random() * 10) + 1; // 1-10
      // Ensure n1 is always greater than n2 for subtraction
      if (n1 < n2) [n1, n2] = [n2, n1];
    } else {
      n1 = Math.floor(Math.random() * 50) + 1; // 1-50
      n2 = Math.floor(Math.random() * 50) + 1; // 1-50
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(randomOperator);
    setUserAnswer("");
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const calculateAnswer = (): number => {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      default:
        return 0;
    }
  };

  const handleVerify = () => {
    const correctAnswer = calculateAnswer();
    const isCorrect = parseInt(userAnswer) === correctAnswer;
    setIsVerified(isCorrect);
    onVerify(isCorrect);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and negative sign
    if (value === "" || /^-?\d+$/.test(value)) {
      setUserAnswer(value);
      setIsVerified(false);
      onVerify(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userAnswer) {
      handleVerify();
    }
  };

  return (
    <div className={className}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Security Verification
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={generateCaptcha}
            className="h-7 px-2 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Math Problem Display */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="bg-white rounded-lg px-4 py-3 border-2 border-gray-300 shadow-sm">
            <span className="text-2xl font-bold text-gray-900 font-mono select-none">
              {num1}
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-700">{operator}</span>
          <div className="bg-white rounded-lg px-4 py-3 border-2 border-gray-300 shadow-sm">
            <span className="text-2xl font-bold text-gray-900 font-mono select-none">
              {num2}
            </span>
          </div>
          <span className="text-2xl font-bold text-gray-700">=</span>
          <div className="relative flex-1 max-w-[100px]">
            <Input
              type="text"
              placeholder="?"
              value={userAnswer}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className={`text-center text-lg font-semibold h-12 ${
                isVerified
                  ? "border-green-500 bg-green-50"
                  : userAnswer && !isVerified
                  ? "border-red-500 bg-red-50"
                  : ""
              }`}
              maxLength={4}
            />
          </div>
        </div>

        {/* Verification Feedback */}
        {userAnswer && (
          <div className="text-center">
            {isVerified ? (
              <p className="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </p>
            ) : (
              <button
                type="button"
                onClick={handleVerify}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to verify
              </button>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Please solve the math problem above to continue
      </p>
    </div>
  );
}