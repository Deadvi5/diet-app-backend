# DietApp Frontend

Frontend minimale in React sviluppato con Vite, Tailwind CSS e [daisyUI](https://daisyui.com/).

## Comandi principali

```bash
npm install       # installa le dipendenze
npm run dev       # avvia il server di sviluppo
npm run build     # crea i file di produzione
```

## Docker

Una volta buildato con `docker compose up --build`, il servizio `frontend` sarà
disponibile su [http://localhost:3000](http://localhost:3000).

### Routing lato client

La configurazione di Nginx include la direttiva `try_files` per servire sempre `index.html`.
In questo modo la navigazione tramite React Router funziona anche ricaricando manualmente la pagina.

## Cambiare tema

Il tema predefinito è definito in `tailwind.config.js` nella sezione `daisyui` con il nome `mytheme`.
Per applicare un tema differente modifica i colori in quel file e assicurati che il componente `Layout` utilizzi l'attributo `data-theme` corrispondente.
