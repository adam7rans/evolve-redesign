import React from 'react';

interface CodexLogoProps {
  className?: string;
}

const CodexLogo: React.FC<CodexLogoProps> = ({ className = '' }) => {
  return (
    <svg className={className} width="262" height="53" viewBox="0 0 262 53" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26.5351" cy="26.5234" r="25.6835" fill="currentColor"/>
      <g transform="translate(73, 4)">
        <path fillRule="evenodd" clipRule="evenodd" d="M53.4564 8.05223C45.464 8.05223 38.9848 14.5314 38.9848 22.5238C38.9848 30.5162 45.464 36.9954 53.4564 36.9954C61.4489 36.9954 67.928 30.5162 67.928 22.5238C67.928 14.5314 61.4489 8.05223 53.4564 8.05223ZM33.625 22.5238C33.625 11.5712 42.5038 2.69238 53.4564 2.69238C64.409 2.69238 73.2879 11.5712 73.2879 22.5238C73.2879 33.4764 64.409 42.3552 53.4564 42.3552C42.5038 42.3552 33.625 33.4764 33.625 22.5238ZM56.8222 0.0478516C67.928 0.0479124 78.2987 2.69238 78.2987 2.69238H88.2136C99.1662 2.69238 108.045 11.5712 108.045 22.5238C108.045 33.4764 99.1662 42.3552 88.2136 42.3552C88.2136 42.3552 81.6041 42.3552 78.2987 42.3552C74.9933 42.3552 64.8004 44.7161 57.616 44.7161C67.928 42.3074 72.6886 37.8395 72.6886 37.8395L72.7061 37.8202C72.7273 37.7965 72.7672 37.7512 72.8231 37.6843C72.9349 37.5506 73.1106 37.3312 73.3296 37.0267C73.7676 36.4173 74.3765 35.4706 74.9933 34.1911C76.2232 31.6397 77.4939 27.7475 77.4939 22.5238C77.4939 17.3001 76.2232 13.4079 74.9933 10.8565C74.3765 9.57703 73.7676 8.63027 73.3296 8.02095C73.1106 7.71647 72.9349 7.49703 72.8231 7.3633C72.7672 7.29646 72.7273 7.25115 72.7061 7.22745L72.691 7.21071L72.6886 7.20815C72.6886 7.20815 67.928 1.63793 56.8222 0.0478516ZM79.5858 8.05223C79.6643 8.20723 79.7429 8.36619 79.8214 8.52909C81.358 11.7166 82.8537 16.4001 82.8537 22.5238C82.8537 28.6475 81.358 33.331 79.8214 36.5185C79.7429 36.6814 79.6643 36.8404 79.5858 36.9954H88.2136C96.206 36.9954 102.685 30.5162 102.685 22.5238C102.685 14.5314 96.206 8.05223 88.2136 8.05223H79.5858ZM102.614 2.69238H125.501C135.237 2.69238 143.613 4.99269 150.674 12.0531L157.355 18.7338L164.983 11.1056C164.983 11.1056 173.572 2.69238 188.077 2.69238C176.023 6.01723 168.773 14.8956 168.773 14.8956L161.145 22.5238L168.773 30.1521C168.773 30.1521 177.434 38.9541 188.077 42.3552C172.588 42.3552 164.983 33.942 164.983 33.942L157.355 26.3138L150.674 32.9946C143.602 40.0667 135.27 42.3552 125.501 42.3552H102.614L107.469 37.7341C109.275 36.0151 110.527 33.3354 111.313 30.3504C112.088 27.4069 112.332 24.458 112.332 22.5238C112.332 20.5955 112.088 17.6464 111.313 14.7011C110.527 11.714 109.275 9.03213 107.469 7.31348L102.614 2.69238ZM153.565 22.5238L146.884 15.843C141.123 10.0825 134.295 8.05223 125.501 8.05223H114.526C115.407 9.78061 116.04 11.6043 116.496 13.3377C117.1 15.6318 117.428 17.9034 117.581 19.8439H131.803V25.2037H117.581C117.428 27.1465 117.1 29.4195 116.496 31.7144C116.04 33.4467 115.407 35.2686 114.526 36.9954H125.501C134.327 36.9954 141.111 34.9773 146.884 29.2046L153.565 22.5238Z" fill="currentColor"/>
        <path d="M24.0848 3.08929L24.1596 3.10873C26.2182 3.64323 29.7602 4.96789 34.3618 3.10873C38.9633 1.24956 42.7593 0.0478516 49.7678 0.0478516C40.8228 2.46328 39.477 5.11441 35.1575 7.38785C30.8379 9.66129 24.9703 8.84853 22.893 8.31726C20.1076 7.7775 17.2243 8.06838 14.602 9.15457C11.9577 10.2499 9.6975 12.1047 8.10734 14.4846C6.51718 16.8644 5.66844 19.6624 5.66844 22.5246C5.66844 25.3868 6.51718 28.1847 8.10734 30.5645C9.6975 32.9444 11.9577 34.7992 14.602 35.8946C17.2265 36.9817 19.4963 37.231 23.6821 37.0221C27.8679 36.8133 31.653 36.0915 35.8794 38.469C40.1058 40.8464 42.8122 43.2089 49.7678 44.7161C39.1133 44.7161 36.53 42.8672 32.7487 41.8344C28.9675 40.8016 23.0379 42.3065 20.9772 42.3074C18.3487 42.3086 14.9404 41.8362 12.5509 40.8464C8.92714 39.3454 5.8299 36.8036 3.65079 33.5423C1.47169 30.281 0.308594 26.4469 0.308594 22.5246C0.308594 18.6023 1.47169 14.7681 3.65079 11.5068C5.8299 8.24555 8.92714 5.70372 12.5509 4.20273C16.1746 2.70173 20.162 2.309 24.0089 3.0742L24.0848 3.08929Z" fill="currentColor"/>
      </g>
    </svg>
  );
};

export default CodexLogo;