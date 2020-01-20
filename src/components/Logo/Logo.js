import React from 'react';

function Logo() {
  return (
    <div className="logo-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="65" viewBox="0 0 131.708 118.625">
        <defs>
          <linearGradient id="a">
            <stop offset="0" stopColor="#88efd0" />
            <stop offset="1" stopColor="#69effb" />
          </linearGradient>
          <linearGradient id="b">
            <stop offset="0" stopColor="#acefd0" />
            <stop offset="1" stopColor="#adeffb" />
          </linearGradient>
          <linearGradient xlinkHref="#a" id="d" x1="33.984" y1="51.58" x2="152.283" y2="51.58" gradientUnits="userSpaceOnUse" />
          <linearGradient xlinkHref="#b" id="c" x1="26.75" y1="87.979" x2="158.458" y2="87.979" gradientUnits="userSpaceOnUse" />
        </defs>
        <g transform="translate(-26.75 -24.625)">
          <rect width="121.708" height="100.542" x="31.75" y="37.708" rx="4.347" ry="6.284" fill="url(#c)" stroke="rgb(70, 89, 97)" strokeWidth="10" strokeMiterLimit="3.6" />
          <rect width="116.536" height="23.176" x="34.865" y="39.992" rx="4.162" ry="5.504" fill="url(#d)" stroke="#74dde6" strokeWidth="1.762" />
          <rect ry="5.933" rx="2.58" y="40.459" x="34.313" height="94.929" width="116.434" fill="none" stroke="#feffff" strokeWidth="5" strokeMiterLimit="3.6" />
          <circle cx="63.441" cy="86.904" r="3.157" fill="rgb(70, 89, 97)" stroke="rgb(70, 89, 97)" strokeWidth="9" />
          <path d="M65.991 100.317c20.586 17.152 37.668 13.675 53.017 0-16.437 15.76-34.157 15.148-53.017 0z" fill="none" stroke="rgb(70, 89, 97)" strokeWidth="8" />
          <circle r="3.157" cy="86.637" cx="122.507" fill="rgb(70, 89, 97)" stroke="rgb(70, 89, 97)" strokeWidth="9" />
          <circle cx="135.315" cy="120.107" r="10.583" fill="#bcade4" fillOpacity=".728" />
          <rect width="10.583" height="21.167" x="42.333" y="27.125" rx="4.914" ry="5.292" fill="#fff" stroke="rgb(70, 89, 97)" strokeWidth="5" strokeMiterLimit="3.6" />
          <rect ry="5.292" rx="4.914" y="27.125" x="132.292" height="21.167" width="10.583" fill="#fff" stroke="rgb(70, 89, 97)" strokeWidth="5" strokeMiterLimit="3.6" />
          <path d="M31.75 64.167h121.708z" fill="none" stroke="rgb(70, 89, 97)" strokeWidth="5" />
        </g>
      </svg>
    </div>
  );
}

export default Logo;