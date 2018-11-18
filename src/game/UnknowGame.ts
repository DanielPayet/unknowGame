import { Application } from "./Application";
import $ from 'jquery';

$(() => {
    Application.bootstrap();
});

if ('serviceWorker' in navigator && process.env.env === "prod") {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}