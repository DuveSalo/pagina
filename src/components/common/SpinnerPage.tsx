
import React from 'react';
import { Spinner } from './Spinner';

const SpinnerPage: React.FC = () => (
  <div className="flex justify-center items-center h-screen bg-surface">
    <Spinner className="w-12 h-12" />
  </div>
);

export default SpinnerPage;
