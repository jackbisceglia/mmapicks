const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-max w-full justify-center py-0 px-8 sm:px-16 md:px-20">
      {children}
    </main>
  );
};

export default Wrapper;
