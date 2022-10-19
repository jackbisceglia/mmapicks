import Image from "next/image";

type JacksEpicImagePropTypes = {
  src: string;
  alt: string;
  className: string;
};

const JacksEpicImage = ({ src, alt, className }: JacksEpicImagePropTypes) => {
  return (
    <div className={`relative  ${className} `}>
      <Image
        className=" drag- select-none rounded-full border-2 "
        src={src}
        alt={alt}
        layout="fill"
      />
    </div>
  );
};

export default JacksEpicImage;
