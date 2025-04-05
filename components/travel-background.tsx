export function TravelBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="travel-bg absolute inset-0"></div>
      <div className="floating-clouds top-[10%] left-[5%] w-32 h-32 bg-ocean-light rounded-full blur-3xl"></div>
      <div className="floating-clouds top-[30%] right-[10%] w-40 h-40 bg-sunset-light rounded-full blur-3xl"></div>
      <div className="floating-clouds bottom-[15%] left-[20%] w-36 h-36 bg-coral-light rounded-full blur-3xl"></div>
    </div>
  )
}

