import React from 'react';
import ContentLoader from 'react-content-loader';

const RowLoader = (props) => (
  <div className="session-row">
    <ContentLoader
      speed={2}
      width={1035}
      height={70}
      viewBox="0 0 1035 70"
      backgroundColor="#d6d6d6"
      foregroundColor="#bdbdbd"
      {...props}>
      <rect x="26" y="26" rx="4" ry="4" width="18" height="18" />

      <rect x="70" y="20" rx="4" ry="4" width="310" height="30" />

      <rect x="400" y="20" rx="4" ry="4" width="90" height="15" />
      <rect x="500" y="20" rx="4" ry="4" width="10" height="15" />
      <rect x="520" y="20" rx="4" ry="4" width="90" height="15" />

      <rect x="630" y="24" rx="11" ry="11" width="96" height="22" />

      <rect x="740" y="18" rx="4" ry="4" width="66" height="33" />

      <rect x="850" y="20" rx="4" ry="4" width="150" height="30" />
    </ContentLoader>
  </div>
);

export default RowLoader;
