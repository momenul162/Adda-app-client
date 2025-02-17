import React from "react";

interface RowProps {
  icon: any;
  propertyName: string;
  value: string;
}

const AboutRow: React.FC<RowProps> = ({ icon, propertyName, value }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="flex items-center gap-1 text-sm font-medium">
        {icon} <span>{propertyName}:</span>
      </p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  );
};

export default AboutRow;
