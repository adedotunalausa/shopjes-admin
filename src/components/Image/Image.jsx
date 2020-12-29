import React from 'react';
import { Img } from 'react-image';
import placeholder from './product-placeholder.png';
const Placeholder = () => <img src={placeholder} alt="placeholder" />;
export default function Image({
  key,
  url,
  alt,
  className,
  style,
}) {
  return (
    <Img
      draggable={false}
      style={style}
      src={url}
      alt={alt}
      loader={<Placeholder />}
      unloader={<Placeholder />}
      key={key}
      className={className}
    />
  );
}
