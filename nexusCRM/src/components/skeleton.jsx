/* eslint-disable react/prop-types */

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-300 ${className}`}></div>
  );
};

export default Skeleton;