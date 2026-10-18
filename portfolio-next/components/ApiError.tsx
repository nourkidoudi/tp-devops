export default function ApiError({ what }: { what: string }) {
  return (
    <p role="alert">
      {`Impossible de charger ${what} : l'API ne répond pas. Vérifiez qu'elle est démarrée (variable API_URL).`}
    </p>
  );
}
