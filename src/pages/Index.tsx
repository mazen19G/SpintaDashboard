import logo from "@/assets/LOGO.png";
import { MatchForm } from "@/components/MatchForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6 flex justify-center">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-28 md:h-56 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12">
          Add New Match
        </h1>
        
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 md:p-12">
          <MatchForm />
        </div>
      </main>
    </div>
  );
};

export default Index;
