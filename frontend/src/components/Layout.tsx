import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { Button } from './ui/button';
import { Leaf, Search, ShoppingCart, User, Plus, LogOut, Menu, Home, Package } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemsCount = cart?.items?.length || 0;

  const NavLink = ({ to, children, className = "" }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-secondary ${
          isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        } ${className}`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">EcoFinds</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/">
              <Home className="w-4 h-4" />
              Marketplace
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/sell/new">
                  <Plus className="w-4 h-4" />
                  Sell Item
                </NavLink>
                <NavLink to="/me/listings">
                  <Package className="w-4 h-4" />
                  My Listings
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                </Button>
                
                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                  <div className="absolute right-0 top-12 w-48 bg-card border rounded-lg shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-3 border-b">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/purchases" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary">
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary w-full text-left text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container py-4 space-y-2">
              <NavLink to="/" className="w-full justify-start">
                <Home className="w-4 h-4" />
                Marketplace
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/sell/new" className="w-full justify-start">
                    <Plus className="w-4 h-4" />
                    Sell Item
                  </NavLink>
                  <NavLink to="/me/listings" className="w-full justify-start">
                    <Package className="w-4 h-4" />
                    My Listings
                  </NavLink>
                  <NavLink to="/dashboard" className="w-full justify-start">
                    <User className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/purchases" className="w-full justify-start">
                    <Package className="w-4 h-4" />
                    My Orders
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="bg-gradient-primary bg-clip-text text-transparent">EcoFinds</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover sustainable products and support eco-friendly businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">All Products</Link></li>
                <li><Link to="/?category=electronics" className="hover:text-foreground">Electronics</Link></li>
                <li><Link to="/?category=clothing" className="hover:text-foreground">Clothing</Link></li>
                <li><Link to="/?category=home" className="hover:text-foreground">Home & Garden</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                    <li><Link to="/me/listings" className="hover:text-foreground">My Listings</Link></li>
                    <li><Link to="/purchases" className="hover:text-foreground">Order History</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
                    <li><Link to="/register" className="hover:text-foreground">Sign Up</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EcoFinds. Built with sustainability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;