# Documentation Frontend EasyMarket

## 1. Architecture Générale

### 1.1 Vue d'ensemble
L'application EasyMarket Dépenses est construite selon une architecture moderne utilisant React Native avec Expo. Elle suit le pattern Flux avec Redux pour la gestion d'état, et implémente une architecture modulaire pour une meilleure maintenabilité.

### 1.2 Structure détaillée des dossiers
```
/EasymarketDepense_frontend
├── App.js                    # Point d'entrée, configuration Redux et Navigation
├── screens/                  # Écrans principaux de l'application
│   ├── Modules.js           # Écran d'accueil avec grille de modules
│   ├── Depenses.js          # Liste et gestion des dépenses
│   ├── AjoutDepenses.js     # Formulaire d'ajout de dépense
│   └── DetailDepenses.js    # Vue détaillée d'une dépense
├── components/              # Composants réutilisables
│   ├── Footer.js           # Barre de navigation
│   ├── DepenseItem.js      # Composant de liste des dépenses
│   ├── FileUpload.js       # Gestion upload fichiers
│   └── CustomInputs/       # Inputs personnalisés
├── src/
│   ├── redux/              # Configuration Redux
│   │   ├── store.js        # Configuration du store
│   │   └── features/
│   │       └── depenses/
│   │           └── depensesSlice.js  # Slice pour les dépenses
│   └── services/
│       └── api.js          # Configuration Axios et endpoints
└── assets/                 # Ressources statiques
```

### 1.3 Configuration du Store Redux
```javascript
// store.js
import { configureStore } from "@reduxjs/toolkit";
import depensesReducer from "./features/depenses/depensesSlice";

export const store = configureStore({
  reducer: {
    depenses: depensesReducer,
  },
});
```

### 1.4 Configuration API
```javascript
// api.js
const API_URL = "https://easymarketdepense-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

// Intercepteur pour la gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    return Promise.reject(error);
  }
);
```

## 2. Gestion d'État avec Redux

### 2.1 Structure du State
```javascript
{
  depenses: {
    items: [],        // Liste des dépenses
    status: 'idle',   // État du chargement
    error: null       // Erreurs éventuelles
  }
}
```

### 2.2 Actions et Reducers
```javascript
// depensesSlice.js
export const fetchDepenses = createAsyncThunk(
  "depenses/fetchDepenses",
  async () => {
    const response = await depensesApi.getAllDepenses();
    return response.data;
  }
);

export const addDepense = createAsyncThunk(
  "depenses/addDepense",
  async (depenseData) => {
    const formData = new FormData();
    // Traitement des données et fichiers
    Object.keys(depenseData).forEach((key) => {
      if (key === "pieceJustificative" && depenseData[key]) {
        formData.append(key, {
          uri: depenseData[key].uri,
          type: depenseData[key].type,
          name: depenseData[key].name,
        });
      } else {
        formData.append(key, depenseData[key]);
      }
    });

    const response = await depensesApi.createDepense(formData);
    return response.data;
  }
);
```

### 2.3 Gestion des États de Chargement
```javascript
extraReducers: (builder) => {
    builder
      .addCase(fetchDepenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDepenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
}
```

## 3. Composants Détaillés

### 3.1 Écran Modules (Modules.js)
```javascript
const Modules = ({ navigation }) => {
  const modules = [
    {
      id: 1,
      title: "Dépenses",
      icon: "money-bill-wave",
      route: "Depenses",
      color: "#4CAF50"
    },
    // ... autres modules
  ];

  const renderModule = ({ item }) => (
    <TouchableOpacity
      style={[styles.moduleCard, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.route)}
    >
      <Icon name={item.icon} size={40} color="white" />
      <Text style={styles.moduleTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={modules}
        renderItem={renderModule}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};
```

### 3.2 Liste des Dépenses (Depenses.js)
```javascript
const Depenses = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(state => state.depenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    dispatch(fetchDepenses());
  }, [dispatch]);

  // Filtrage des dépenses
  const filteredDepenses = useMemo(() => {
    return items.filter(depense => {
      const matchSearch = depense.title.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchCategory = filterCategory ? 
        depense.category === filterCategory : true;
      return matchSearch && matchCategory;
    });
  }, [items, searchQuery, filterCategory]);

  // Gestion du rafraîchissement
  const handleRefresh = () => {
    dispatch(fetchDepenses());
  };

  // Rendu conditionnel selon le statut
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Rechercher une dépense..."
      />
      <CategoryFilter
        selectedCategory={filterCategory}
        onSelectCategory={setFilterCategory}
      />
      <FlatList
        data={filteredDepenses}
        renderItem={({ item }) => (
          <DepenseItem
            depense={item}
            onPress={() => navigation.navigate('DetailDepenses', { id: item.id })}
          />
        )}
        refreshing={status === 'loading'}
        onRefresh={handleRefresh}
        ListEmptyComponent={<EmptyState />}
      />
      <FAB
        icon="plus"
        onPress={() => navigation.navigate('AjoutDepenses')}
      />
    </View>
  );
};
```

### 3.3 Formulaire d'Ajout (AjoutDepenses.js)
```javascript
const AjoutDepenses = ({ navigation }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    payment_method: '',
    pieceJustificative: null
  });
  const [errors, setErrors] = useState({});

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Titre requis";
    if (!formData.amount) newErrors.amount = "Montant requis";
    if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Montant invalide";
    }
    if (!formData.category) newErrors.category = "Catégorie requise";
    if (!formData.payment_method) {
      newErrors.payment_method = "Moyen de paiement requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de l'upload de fichier
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({
          ...prev,
          pieceJustificative: {
            uri: file.uri,
            type: file.mimeType,
            name: file.name
          }
        }));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger le fichier");
    }
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await dispatch(addDepense(formData)).unwrap();
        navigation.goBack();
      } catch (error) {
        Alert.alert("Erreur", "Impossible d'ajouter la dépense");
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Titre"
        value={formData.title}
        onChangeText={(text) => setFormData({...formData, title: text})}
        error={errors.title}
      />
      {/* Autres champs du formulaire */}
      <Button
        mode="contained"
        onPress={handleFileUpload}
        icon="file-upload"
      >
        Ajouter une pièce justificative
      </Button>
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Enregistrer
      </Button>
    </ScrollView>
  );
};
```

## 4. Gestion des Fichiers

### 4.1 Configuration du Picker
```javascript
const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: false
    });

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      
      // Vérification de la taille
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error("Fichier trop volumineux");
      }

      return {
        uri: file.uri,
        type: file.mimeType,
        name: file.name
      };
    }
  } catch (error) {
    throw new Error("Erreur lors de la sélection du fichier");
  }
};
```

### 4.2 Prévisualisation des Fichiers
```javascript
const FilePreview = ({ file }) => {
  if (!file) return null;

  const isPDF = file.type === 'application/pdf';

  return (
    <View style={styles.previewContainer}>
      {isPDF ? (
        <View style={styles.pdfPreview}>
          <Icon name="file-pdf" size={40} color="red" />
          <Text>{file.name}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: file.uri }}
          style={styles.imagePreview}
          resizeMode="contain"
        />
      )}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={onRemove}
      >
        <Icon name="times-circle" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};
```

## 5. Navigation

### 5.1 Configuration du Navigator
```javascript
// navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Modules"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Modules" 
          component={Modules}
          options={{
            title: 'EasyMarket Dépenses',
            headerLeft: null,
          }}
        />
        <Stack.Screen 
          name="Depenses" 
          component={Depenses}
          options={({ navigation }) => ({
            title: 'Dépenses',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('AjoutDepenses')}
              >
                <Icon name="plus" size={24} color="white" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="AjoutDepenses" 
          component={AjoutDepenses}
          options={{
            title: 'Nouvelle Dépense',
          }}
        />
        <Stack.Screen 
          name="DetailDepenses" 
          component={DetailDepenses}
          options={{
            title: 'Détails',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 5.2 Gestion de la Navigation
```javascript
// Hooks de navigation personnalisés
export const useNavigation = () => {
  const navigation = useNavigation();

  const navigateToDetail = useCallback((id) => {
    navigation.navigate('DetailDepenses', { id });
  }, [navigation]);

  const navigateToEdit = useCallback((id) => {
    navigation.navigate('AjoutDepenses', { id, mode: 'edit' });
  }, [navigation]);

  return {
    navigateToDetail,
    navigateToEdit,
  };
};
```

## 6. Gestion des Erreurs

### 6.1 Intercepteur Global
```javascript
// services/errorHandler.js
const errorHandler = {
  setup() {
    axios.interceptors.response.use(
      response => response,
      error => {
        // Erreurs réseau
        if (!error.response) {
          Alert.alert(
            "Erreur de connexion",
            "Vérifiez votre connexion internet"
          );
          return Promise.reject(error);
        }

        // Erreurs API
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            Alert.alert("Erreur", "Données invalides");
            break;
          case 401:
            // Redirection vers login
            break;
          case 403:
            Alert.alert("Erreur", "Accès non autorisé");
            break;
          case 404:
            Alert.alert("Erreur", "Ressource non trouvée");
            break;
          case 500:
            Alert.alert("Erreur", "Erreur serveur");
            break;
          default:
            Alert.alert("Erreur", "Une erreur est survenue");
        }

        return Promise.reject(error);
      }
    );
  }
};
```

### 6.2 Gestion des Erreurs de Formulaire
```javascript
// hooks/useFormValidation.js
export const useFormValidation = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};

    // Validation du titre
    if (!values.title) {
      newErrors.title = "Le titre est requis";
    } else if (values.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    // Validation du montant
    if (!values.amount) {
      newErrors.amount = "Le montant est requis";
    } else {
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = "Le montant doit être un nombre positif";
      }
    }

    // Validation de la catégorie
    if (!values.category) {
      newErrors.category = "La catégorie est requise";
    }

    // Validation de la catégorie personnalisée
    if (values.category === 'AUTRE' && !values.custom_category) {
      newErrors.custom_category = "La catégorie personnalisée est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    touched,
    setValues,
    setTouched,
    validate,
  };
};
```

## 7. Optimisations

### 7.1 Memoization des Composants
```javascript
// components/DepenseItem.js
const DepenseItem = React.memo(({ depense, onPress }) => {
  const formatAmount = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  }, []);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(depense.id)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{depense.title}</Text>
        <Text style={styles.amount}>
          {formatAmount(depense.amount)}
        </Text>
        <Text style={styles.category}>{depense.category}</Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.depense.id === nextProps.depense.id &&
         prevProps.depense.amount === nextProps.depense.amount;
});
```

### 7.2 Optimisation des Listes
```javascript
// components/DepensesList.js
const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const keyExtractor = item => item.id.toString();

const DepensesList = ({ depenses, onItemPress }) => {
  const renderItem = useCallback(({ item }) => (
    <DepenseItem
      depense={item}
      onPress={onItemPress}
    />
  ), [onItemPress]);

  return (
    <FlatList
      data={depenses}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
};
```

## 8. Styles et Thèmes

### 8.1 Configuration du Thème
```javascript
// styles/theme.js
export const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    error: '#F44336',
    warning: '#FFC107',
    success: '#8BC34A',
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 20,
      fontWeight: '600',
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    }
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    }
  }
};
```

### 8.2 Styles Globaux
```javascript
// styles/globalStyles.js
import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.text.disabled,
    borderRadius: 4,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: '600',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.caption.fontSize,
    marginTop: theme.spacing.xs,
  }
});
```

## 9. Utilitaires

### 9.1 Formatage des Données
```javascript
// utils/formatters.js
export const formatters = {
  // Formatage des montants
  currency: (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Formatage des dates
  date: (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Formatage des catégories
  category: (category) => {
    const categories = {
      'SALAIRE': 'Salaire',
      'EAU': 'Eau',
      'ELECTRICITE': 'Électricité',
      'LOYER': 'Loyer',
      'TRANSPORT': 'Transport',
      'APPROVISIONNEMENT': 'Approvisionnement',
      'AUTRE': 'Autre',
    };
    return categories[category] || category;
  },
};
```

### 9.2 Validateurs
```javascript
// utils/validators.js
export const validators = {
  // Validation des montants
  amount: (value) => {
    if (!value) return "Le montant est requis";
    const amount = parseFloat(value.replace(/[^\d.-]/g, ''));
    if (isNaN(amount)) return "Montant invalide";
    if (amount <= 0) return "Le montant doit être positif";
    return null;
  },

  // Validation des fichiers
  file: (file) => {
    if (!file) return null;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return "Type de fichier non supporté";
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "Fichier trop volumineux (max 5MB)";
    }
    
    return null;
  },

  // Validation des champs requis
  required: (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} est requis`;
    }
    return null;
  }
};
```

### 9.3 Hooks Personnalisés
```javascript
// hooks/useDebounce.js
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/useNetworkStatus.js
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};
```

## 10. Performance et Monitoring

### 10.1 Performance Tracking
```javascript
// utils/performance.js
export const performanceTracker = {
  startTime: null,

  start() {
    this.startTime = Date.now();
  },

  end(operation) {
    if (!this.startTime) return;
    
    const duration = Date.now() - this.startTime;
    console.log(`${operation} took ${duration}ms`);
    
    // Envoi des métriques au service de monitoring
    if (duration > 1000) {
      // Alert pour les opérations longues
      console.warn(`Long operation detected: ${operation}`);
    }
    
    this.startTime = null;
  }
};
```

