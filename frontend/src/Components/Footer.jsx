export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-4 mt-auto shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        <p className="text-sm">
          © {year} | Desarrollado por {"Eri"}
          <span className="font-semibold">Ramírez Luana Abigail</span>
        </p>
        <p className="text-sm mt-2 sm:mt-0 text-white/80">
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
