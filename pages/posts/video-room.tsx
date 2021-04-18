import Link from 'next/link';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout';

interface Props {}

export default function VideoRoom({}: Props): ReactElement {
  const videoRef = useRef(null);
  const [callButtonEnabled, setCallButtonEnabled] = useState(true);
  const [hangUpButtonEnabled, setHangUpButtonEnabled] = useState(false);
  useEffect(() => {
    (async () => {
      const constraints = { video: true };
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        videoRef.current.srcObject = mediaStream;

        // TODO specify stun/ turn servers
        const configuration = {
          iceServers: [
            {
              urls: 'stun:stun.services.mozilla.com',
              username: '',
              credential: '',
            },
            {
              urls: ['stun:stun.example.com', 'stun:stun-1.example.com'],
            },
          ],
        };
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addEventListener('icecandidate', (_event) => {});
        peerConnection.addEventListener(
          'iceconnectionstatechange',
          (_event) => {
            console.log(
              `Connection state changed to ${peerConnection.iceConnectionState}`
            );
          }
        );
      } catch (e) {
        // Error getting stream
        console.error({ e });
        // if (e instanceof DOMException) {
        //   switch (e) {
        //     case DOMException.NO_DATA_ALLOWED_ERR:
        //       break;
        //     case DOMException.NOT_FOUND_ERR:
        //       break;
        //   }
        // }
      }
    })();
  }, []);

  const callHandler = () => {
    console.log('Call pressed');
    setCallButtonEnabled(false);
    setHangUpButtonEnabled(true);
  };

  const hangUpHandler = () => {
    console.log('Call killed');
    setCallButtonEnabled(true);
    setHangUpButtonEnabled(false);
  };

  return (
    <Layout>
      <Head>
        <title>WebRTC Video Room</title>
      </Head>
      <div className='container'>
        <h1>Hello</h1>
        <Link href='/'>
          <a>Go back</a>
        </Link>
        <video
          playsInline
          autoPlay
          loop
          width={500}
          muted
          ref={videoRef}
        ></video>
        <button onClick={callHandler} disabled={!callButtonEnabled}>
          Call
        </button>
        <button onClick={hangUpHandler} disabled={!hangUpButtonEnabled}>
          Hand up
        </button>
      </div>
    </Layout>
  );
}
