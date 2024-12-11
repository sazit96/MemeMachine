import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    });

    const [allMeme, setAllMeme] = useState([]);
    const memeRef = useRef(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMeme(data.data.memes));
    }, []);

    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMeme.length);
        const newMemeUrl = allMeme[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }));
    }

    function handleChange(event) {
        const { value, name } = event.currentTarget;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }

    function handleDownload() {
        if (memeRef.current) {
            const img = memeRef.current.querySelector("img");
            if (img.complete) {
                generateCanvas();
            } else {
                img.onload = generateCanvas;
            }
        }
    }

    function generateCanvas() {
        html2canvas(memeRef.current, { useCORS: true }).then(canvas => {
            const link = document.createElement("a");
            link.download = "meme.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }

    return (
        <main>
            <div className="form">
                <label>
                    Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme" ref={memeRef}>
                <img src={meme.imageUrl} alt="Meme" crossOrigin="anonymous" />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
            <button className="download-btn" onClick={handleDownload}>Download Meme</button>
        </main>
    );
}
