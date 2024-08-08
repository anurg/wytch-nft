import { FC } from 'react';
 
export const Footer2: FC = () => {
    const images = [
        "https://imgswitch.pages.dev/imgs/3.jpg",
        "https://imgswitch.pages.dev/imgs/4.jpg",
        "https://imgswitch.pages.dev/imgs/5.jpg",
        "https://imgswitch.pages.dev/imgs/6.jpg",
        "https://imgswitch.pages.dev/imgs/7.jpg",
        "https://imgswitch.pages.dev/imgs/8.jpg",
        "https://imgswitch.pages.dev/imgs/9.jpg",
        "https://imgswitch.pages.dev/imgs/10.jpg",
        "https://imgswitch.pages.dev/imgs/11.jpg",
        "https://imgswitch.pages.dev/imgs/3.jpg",
        "https://imgswitch.pages.dev/imgs/4.jpg",
        "https://imgswitch.pages.dev/imgs/6.jpg",
        "https://imgswitch.pages.dev/imgs/7.jpg",
 
        "https://imgswitch.pages.dev/imgs/11.jpg",
    ];

    return (
        <div className="footer-container w-full overflow-hidden -mt-4">
            <div className="slider">
                <div className="slide-track2">
                    {images.map((src, index) => (
                        <div className="slide" key={index}>
                            <img className="carouselIMG" src={src} alt={`img-${index}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
