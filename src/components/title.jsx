import React from "react";

const Title = ({ alertme, title, subtitle }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <span className="text-sm text-gray-500">{subtitle}</span>
    </div>
  );
};

export default Title;
