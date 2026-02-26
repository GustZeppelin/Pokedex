function PokeFilter() {
  return (
    <div className="w-full h-20 bg-gray-200 flex items-center justify-center">
      <input 
        type="text" 
        placeholder="Search Pokemon" 
        className="w-1/2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        
      />
    </div>
  );
}

export default PokeFilter;