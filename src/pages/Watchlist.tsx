// src/pages/Watchlist.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, Edit3, Trash2, Heart, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Watchlist = () => {
  const { user, watchlist, removeFromWatchlist, updateWatchlistItem } = useAuth();
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editTags, setEditTags] = useState("");

  const handleEdit = (coinId: string, currentNote: string, currentTags: string[]) => {
    setEditingItem(coinId);
    setEditNote(currentNote || "");
    setEditTags(currentTags?.join(", ") || "");
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      const tagsArray = editTags.split(",").map(tag => tag.trim()).filter(tag => tag);
      updateWatchlistItem(editingItem, editNote, tagsArray);
      setEditingItem(null); // Tutup dialog setelah disimpan
      setEditNote("");
      setEditTags("");
      toast({
        title: "Updated",
        description: "Watchlist item updated successfully",
      });
    }
  };

  const handleRemove = (coinId: string, coinName: string) => {
    removeFromWatchlist(coinId);
    toast({
      title: "Removed",
      description: `${coinName} has been removed from your watchlist`,
    });
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  console.log("Watchlist Page Loaded. User:", user); // Debug log
  console.log("Watchlist items:", watchlist); // Debug log

  if (!user) {
    console.log("User is not logged in, showing Login Required card."); // Debug log
    return (
      <div className="min-h-screen bg-crypto-gradient">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="crypto-card text-center max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Login Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                You need to be logged in to view your watchlist.
              </p>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple hover:opacity-90">
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crypto-gradient">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
            <p className="text-slate-400">
              Track your favorite cryptocurrencies and add personal notes
            </p>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Heart className="w-5 h-5 text-crypto-accent-blue" />
            <span>{watchlist.length} coins</span>
          </div>
        </div>

        {watchlist.length === 0 ? (
          <Card className="crypto-card text-center max-w-md mx-auto">
            <CardContent className="py-8">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
              <p className="text-slate-400 mb-6">
                Start building your watchlist by adding coins from the market overview or trending page.
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Explore Coins
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((item) => (
              <Card key={item.id} className="crypto-card hover:scale-105 transition-transform duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Link to={`/coin/${item.coinId}`} className="flex items-center space-x-3 flex-1">
                      <img
                        src={item.coinImage}
                        alt={item.coinName}
                        className="w-10 h-10 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-white">{item.coinName}</h3>
                        <p className="text-sm text-slate-400 uppercase">{item.coinSymbol}</p>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-crypto-accent-blue"
                            onClick={() => handleEdit(item.coinId, item.note || "", item.tags || [])}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Edit {item.coinName}</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Add personal notes and tags to organize your watchlist
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="note" className="text-slate-300">Personal Note</Label>
                              <Input
                                id="note"
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                placeholder="Add your thoughts about this coin..."
                                className="bg-slate-900 border-slate-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="tags" className="text-slate-300">Tags (comma separated)</Label>
                              <Input
                                id="tags"
                                value={editTags}
                                onChange={(e) => setEditTags(e.target.value)}
                                placeholder="e.g., long-term, risky, defi"
                                className="bg-slate-900 border-slate-600 text-white"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingItem(null)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleSaveEdit}
                              className="bg-gradient-to-r from-crypto-accent-blue to-crypto-accent-purple"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-crypto-danger"
                        onClick={() => handleRemove(item.coinId, item.coinName)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Price when added</span>
                      <span className="text-xl font-bold text-white">
                        {formatPrice(item.coinPrice)}
                      </span>
                    </div>

                    {item.note && (
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <p className="text-sm text-slate-300">{item.note}</p>
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-crypto-accent-blue/20 text-crypto-accent-blue rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-slate-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Watchlist;