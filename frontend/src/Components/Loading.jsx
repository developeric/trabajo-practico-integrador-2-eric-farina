export const Loading = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div>
      <h1>Cargando...</h1>
    </div>
  );
};
