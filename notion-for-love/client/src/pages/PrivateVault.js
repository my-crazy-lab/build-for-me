/**
 * Love Journey - Private Vault Page
 *
 * Secure storage for sensitive information, private notes,
 * passwords, and confidential documents with encryption.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Unlock, Plus, Eye, EyeOff, Key, Shield,
  FileText, CreditCard, User, Heart, Trash2,
  Edit, Copy, Download, Upload, Search, Filter,
  AlertTriangle, CheckCircle, Clock, Star
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const PrivateVault = () => {
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(true);

  // Vault categories with icons and colors
  const vaultCategories = {
    password: {
      name: 'Passwords',
      icon: Key,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    financial: {
      name: 'Financial',
      icon: CreditCard,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    personal: {
      name: 'Personal Info',
      icon: User,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    intimate: {
      name: 'Intimate',
      icon: Heart,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    document: {
      name: 'Documents',
      icon: FileText,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20'
    },
    note: {
      name: 'Secure Notes',
      icon: FileText,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    }
  };

  // Mock vault data (encrypted in real implementation)
  const mockVaultItems = [
    {
      id: 1,
      title: "Shared Bank Account",
      category: "financial",
      type: "bank_account",
      data: {
        accountNumber: "****-****-****-1234",
        routingNumber: "021000021",
        bankName: "First National Bank",
        accountType: "Joint Checking"
      },
      notes: "Our main shared account for household expenses",
      tags: ["joint", "checking", "primary"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-12-01T14:30:00Z",
      isFavorite: true,
      isShared: true,
      accessLevel: "both"
    },
    {
      id: 2,
      title: "Anniversary Surprise Plans",
      category: "intimate",
      type: "note",
      data: {
        content: "Planning a surprise weekend getaway to the cabin where we first said 'I love you'. Booked for June 14-16. Restaurant reservations at 7 PM on the 14th. Don't let them see this!"
      },
      notes: "Keep this secret until the surprise!",
      tags: ["surprise", "anniversary", "secret"],
      createdAt: "2024-05-01T09:00:00Z",
      updatedAt: "2024-05-15T16:20:00Z",
      isFavorite: true,
      isShared: false,
      accessLevel: "self"
    },
    {
      id: 3,
      title: "Netflix Account",
      category: "password",
      type: "login",
      data: {
        username: "ourcouple@email.com",
        password: "••••••••••••",
        website: "netflix.com",
        notes: "Family plan - 4 screens"
      },
      notes: "Shared streaming account",
      tags: ["streaming", "entertainment", "shared"],
      createdAt: "2024-02-10T12:00:00Z",
      updatedAt: "2024-11-20T10:15:00Z",
      isFavorite: false,
      isShared: true,
      accessLevel: "both"
    },
    {
      id: 4,
      title: "Emergency Contacts",
      category: "personal",
      type: "contact_list",
      data: {
        contacts: [
          { name: "Mom", phone: "(555) 123-4567", relationship: "Mother" },
          { name: "Dad", phone: "(555) 234-5678", relationship: "Father" },
          { name: "Dr. Smith", phone: "(555) 345-6789", relationship: "Family Doctor" }
        ]
      },
      notes: "Important contacts for emergencies",
      tags: ["emergency", "family", "medical"],
      createdAt: "2024-01-20T15:30:00Z",
      updatedAt: "2024-10-05T11:45:00Z",
      isFavorite: true,
      isShared: true,
      accessLevel: "both"
    },
    {
      id: 5,
      title: "Love Letters Collection",
      category: "intimate",
      type: "document",
      data: {
        fileType: "PDF Collection",
        fileName: "love_letters_2023_2024.pdf",
        fileSize: "2.4 MB",
        description: "Digital copies of all our handwritten love letters"
      },
      notes: "Our most precious written memories",
      tags: ["letters", "memories", "precious"],
      createdAt: "2024-03-14T20:00:00Z",
      updatedAt: "2024-12-20T18:30:00Z",
      isFavorite: true,
      isShared: true,
      accessLevel: "both"
    },
    {
      id: 6,
      title: "Insurance Policy",
      category: "document",
      type: "insurance",
      data: {
        policyNumber: "POL-2024-789456",
        provider: "SecureLife Insurance",
        type: "Life Insurance",
        beneficiary: "Partner",
        coverage: "$500,000"
      },
      notes: "Life insurance policy with partner as beneficiary",
      tags: ["insurance", "life", "protection"],
      createdAt: "2024-04-01T14:00:00Z",
      updatedAt: "2024-04-01T14:00:00Z",
      isFavorite: false,
      isShared: true,
      accessLevel: "both"
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (isUnlocked) {
        setVaultItems(mockVaultItems);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isUnlocked]);

  const handleUnlockVault = (password) => {
    // In real implementation, this would verify against encrypted master password
    if (password === 'vault123') {
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setMasterPassword('');
    } else {
      alert('Incorrect master password');
    }
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setVaultItems([]);
    setShowPasswordModal(true);
    setSelectedItem(null);
    setShowAddModal(false);
  };

  const filteredItems = vaultItems.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const getVaultStats = () => {
    const total = vaultItems.length;
    const shared = vaultItems.filter(item => item.isShared).length;
    const privateItems = vaultItems.filter(item => !item.isShared).length;
    const favorites = vaultItems.filter(item => item.isFavorite).length;

    return { total, shared, private: privateItems, favorites };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isUnlocked) {
    return (
      <VaultPasswordModal
        isOpen={showPasswordModal}
        onUnlock={handleUnlockVault}
        masterPassword={masterPassword}
        setMasterPassword={setMasterPassword}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="pulse"
          text="Decrypting your vault..."
        />
      </div>
    );
  }

  const stats = getVaultStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Private Vault
            </h1>
            <Badge variant="success" size="sm">
              <Unlock className="w-3 h-3 mr-1" />
              Unlocked
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Secure storage for your most sensitive information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Lock className="w-4 h-4" />}
            onClick={handleLockVault}
          >
            Lock Vault
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
              Security Notice
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your vault is protected with end-to-end encryption. Always use a strong master password and never share it with anyone.
            </p>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Shared
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.shared}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Private
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.private}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Favorites
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.favorites}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search vault items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(vaultCategories).map(([key, category]) => (
                <option key={key} value={key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Vault Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <VaultItemCard
            key={item.id}
            item={item}
            index={index}
            vaultCategories={vaultCategories}
            formatDate={formatDate}
            onClick={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by adding your first secure item to the vault.'
            }
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add First Item
          </Button>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Vault Item"
        size="lg"
      >
        <VaultItemForm
          vaultCategories={vaultCategories}
          onClose={() => setShowAddModal(false)}
          onSave={(newItem) => {
            setVaultItems([...vaultItems, { ...newItem, id: Date.now() }]);
            setShowAddModal(false);
          }}
        />
      </Modal>

      {/* Item Detail Modal */}
      {selectedItem && (
        <VaultItemDetailModal
          item={selectedItem}
          vaultCategories={vaultCategories}
          onClose={() => setSelectedItem(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Vault Password Modal Component
const VaultPasswordModal = ({ isOpen, onUnlock, masterPassword, setMasterPassword }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUnlock(masterPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card variant="glass" className="backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Private Vault
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your master password to access your secure vault
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Master Password"
              type={showPassword ? 'text' : 'password'}
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              leftIcon={<Key className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              placeholder="Enter your master password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Unlock className="w-4 h-4" />}
              disabled={!masterPassword}
            >
              Unlock Vault
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Demo Access
              </h3>
              <div className="text-xs text-blue-600 dark:text-blue-300">
                <p>Master Password: vault123</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your vault is protected with AES-256 encryption
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// Vault Item Card Component
const VaultItemCard = ({ item, index, vaultCategories, formatDate, onClick }) => {
  const category = vaultCategories[item.category];
  const CategoryIcon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={() => onClick(item)}
    >
      <Card hover className="relative">
        {/* Favorite Badge */}
        {item.isFavorite && (
          <div className="absolute top-2 right-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </div>
        )}

        {/* Category Icon */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
            <CategoryIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <Badge variant={category.textColor.includes('blue') ? 'info' : 'default'} size="sm">
              {category.name}
            </Badge>
            {item.isShared && (
              <Badge variant="success" size="sm" className="ml-2">
                Shared
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {item.title}
          </h3>

          {item.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {item.notes}
            </p>
          )}

          {/* Data Preview */}
          <div className="space-y-2">
            {item.type === 'login' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div>Username: {item.data.username}</div>
                <div>Password: ••••••••••••</div>
              </div>
            )}

            {item.type === 'bank_account' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div>{item.data.bankName}</div>
                <div>Account: {item.data.accountNumber}</div>
              </div>
            )}

            {item.type === 'note' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div className="line-clamp-2">{item.data.content}</div>
              </div>
            )}

            {item.type === 'document' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <div>{item.data.fileType}</div>
                <div>{item.data.fileSize}</div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" size="sm">
                #{tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Updated {formatDate(item.updatedAt)}</span>
            <div className="flex items-center space-x-1">
              {item.accessLevel === 'both' ? (
                <User className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              <span>{item.accessLevel === 'both' ? 'Both' : 'Private'}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Vault Item Form Component
const VaultItemForm = ({ vaultCategories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'password',
    type: 'login',
    data: {},
    notes: '',
    tags: '',
    isFavorite: false,
    isShared: false,
    accessLevel: 'self'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newItem = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newItem);
  };

  const renderDataFields = () => {
    switch (formData.type) {
      case 'login':
        return (
          <>
            <Input
              label="Username/Email"
              value={formData.data.username || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, username: e.target.value }
              })}
              placeholder="username@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={formData.data.password || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, password: e.target.value }
              })}
              placeholder="Enter password"
            />
            <Input
              label="Website"
              value={formData.data.website || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, website: e.target.value }
              })}
              placeholder="example.com"
            />
          </>
        );

      case 'note':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secure Note Content
            </label>
            <textarea
              value={formData.data.content || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, content: e.target.value }
              })}
              placeholder="Enter your secure note content..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        );

      case 'bank_account':
        return (
          <>
            <Input
              label="Bank Name"
              value={formData.data.bankName || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, bankName: e.target.value }
              })}
              placeholder="First National Bank"
            />
            <Input
              label="Account Number"
              value={formData.data.accountNumber || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, accountNumber: e.target.value }
              })}
              placeholder="****-****-****-1234"
            />
            <Input
              label="Routing Number"
              value={formData.data.routingNumber || ''}
              onChange={(e) => setFormData({
                ...formData,
                data: { ...formData.data, routingNumber: e.target.value }
              })}
              placeholder="021000021"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Item Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Netflix Account"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(vaultCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Item Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, data: {} })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="login">Login Credentials</option>
          <option value="note">Secure Note</option>
          <option value="bank_account">Bank Account</option>
          <option value="document">Document</option>
          <option value="contact_list">Contact List</option>
        </select>
      </div>

      {renderDataFields()}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about this item..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="important, shared, backup"
        helperText="Add tags to help organize your vault items"
      />

      <div className="flex items-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Mark as favorite</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isShared}
            onChange={(e) => setFormData({
              ...formData,
              isShared: e.target.checked,
              accessLevel: e.target.checked ? 'both' : 'self'
            })}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Share with partner</span>
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Item
        </Button>
      </div>
    </form>
  );
};

// Vault Item Detail Modal Component
const VaultItemDetailModal = ({ item, vaultCategories, onClose, formatDate }) => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const category = vaultCategories[item.category];
  const CategoryIcon = category.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a toast notification here
    alert('Copied to clipboard!');
  };

  const renderItemData = () => {
    switch (item.type) {
      case 'login':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username/Email
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  value={item.data.username}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.data.username)}
                  leftIcon={<Copy className="w-3 h-3" />}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type={showSensitiveData ? 'text' : 'password'}
                  value={showSensitiveData ? 'SecurePassword123!' : '••••••••••••'}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  leftIcon={showSensitiveData ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                >
                  {showSensitiveData ? 'Hide' : 'Show'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('SecurePassword123!')}
                  leftIcon={<Copy className="w-3 h-3" />}
                >
                  Copy
                </Button>
              </div>
            </div>

            {item.data.website && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={item.data.website}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`https://${item.data.website}`, '_blank')}
                  >
                    Visit
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'bank_account':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bank Name
              </label>
              <Input value={item.data.bankName} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Number
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  value={showSensitiveData ? '1234-5678-9012-3456' : item.data.accountNumber}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSensitiveData(!showSensitiveData)}
                  leftIcon={showSensitiveData ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                >
                  {showSensitiveData ? 'Hide' : 'Show'}
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Routing Number
              </label>
              <Input value={item.data.routingNumber} readOnly />
            </div>

            {item.data.accountType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account Type
                </label>
                <Input value={item.data.accountType} readOnly />
              </div>
            )}
          </div>
        );

      case 'note':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Note Content
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {item.data.content}
              </p>
            </div>
          </div>
        );

      case 'document':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Type
              </label>
              <Input value={item.data.fileType} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Name
              </label>
              <Input value={item.data.fileName} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                File Size
              </label>
              <Input value={item.data.fileSize} readOnly />
            </div>

            {item.data.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Input value={item.data.description} readOnly />
              </div>
            )}

            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
              fullWidth
            >
              Download Document
            </Button>
          </div>
        );

      case 'contact_list':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contacts
            </label>
            <div className="space-y-3">
              {item.data.contacts.map((contact, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.relationship}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        {contact.phone}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(contact.phone)}
                        leftIcon={<Copy className="w-3 h-3" />}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500 dark:text-gray-400">No data to display</p>;
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={item.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
              <CategoryIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <Badge variant={category.textColor.includes('blue') ? 'info' : 'default'} size="sm">
                {category.name}
              </Badge>
              {item.isFavorite && (
                <Badge variant="warning" size="sm" className="ml-2">
                  <Star className="w-3 h-3 mr-1" />
                  Favorite
                </Badge>
              )}
              {item.isShared && (
                <Badge variant="success" size="sm" className="ml-2">
                  Shared
                </Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Updated {formatDate(item.updatedAt)}
          </div>
        </div>

        {/* Notes */}
        {item.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300">{item.notes}</p>
          </div>
        )}

        {/* Item Data */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Details</h4>
          {renderItemData()}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Access Info */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {item.accessLevel === 'both' ? 'Shared' : 'Private'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Access Level
              </div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                {formatDate(item.createdAt)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Created
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" leftIcon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button variant="error" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrivateVault;
