import React from 'react';

function Promo(): React.ReactElement {
  return (
    <div className="flex flex-col">
      <span className="mb mb-2">
        Links Detector makes printed links clickable via your smartphone camera
      </span>
      <span className="text-xs font-light">
        No need to type a link in, just scan and click on it
      </span>
    </div>
  );
}

export default Promo;
