import React, { useState, useEffect, useRef } from 'react';
import qrCode from './qr.jpg';

const medias = {
    video: {
        width: 320,
        height: 320,
    },
    audio: false,
};

declare global {
    interface Window {
        BarcodeDetector: any;
    }
}

function App() {
    const [detector, setDetector] = useState<any>(null);
    const [message, setMessage] = useState<string>('');
    const mediaRef = useRef<HTMLVideoElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia(medias)
            .then((stream) => {
                if (!mediaRef.current) return;
                mediaRef.current.srcObject = stream;
            })
            .catch((e) => console.error('error'));
        setDetector(new window.BarcodeDetector());
        return () => {};
        // eslint-disable-next-line
    }, []);

    const getContext = () => {
        if (!canvasRef.current) return;
        return canvasRef.current.getContext('2d');
    };

    const drawImage = (resourceType: 'video' | 'pircture') => {
        const resource = resourceType === 'video' ? mediaRef.current : imgRef.current;
        const context = getContext();
        if (!context) return;
        if (!window.BarcodeDetector) return;
        detector
            .detect(resource)
            .then((success: any) => {
                if (!resource) return;
                const result = success.length > 0 ? 'バーコードが見つかりました。' : '何も見つかりませんでした。';
                setMessage(result);
                context.drawImage(resource, 0, 0, 320, 320);
            })
            .catch((e: Error) => console.error(e));
    };

    return (
        <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div
                    style={{
                        display: 'flex',
                        flexFlow: 'column',
                    }}
                >
                    <video id="player" ref={mediaRef} muted autoPlay></video>
                    <button
                        onClick={() => {
                            drawImage('video');
                        }}
                    >
                        カメラから読み込む
                    </button>
                </div>
                <div style={{ display: 'flex', flexFlow: 'column', paddingLeft: '8px' }}>
                    <img
                        src={qrCode}
                        alt="QR-コード"
                        ref={imgRef}
                        width="320px"
                        height="320px"
                        style={{ border: 'solid 1px' }}
                    />
                    <button
                        onClick={() => {
                            drawImage('pircture');
                        }}
                    >
                        画像から読み込む
                    </button>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexFlow: 'column wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ width: '320px' }}>
                    <canvas id="snapshot" ref={canvasRef} width={320} height={320} />
                    Barcode text : {message}
                </div>
            </div>
        </div>
    );
}

export default App;
