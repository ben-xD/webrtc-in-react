import Link from 'next/link';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/layout';

interface Props {}

export default function KensingtonKoi({}: Props): ReactElement {
  const videoRef = useRef(null);

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

  return (
    <Layout>
      <Head>
        <title>Kensington Koi</title>
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
      </div>
    </Layout>
  );
}
