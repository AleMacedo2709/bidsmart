
const handleTogglePreference = async (key: keyof Preferences) => {
  console.log(`Toggling preference: ${key}`);
  const newPreferences = {
    ...preferences,
    [key]: !preferences[key]
  };
  
  setPreferences(newPreferences);
  
  // Envio de email baseado no perfil do usuário
  if (newPreferences[key]) {
    console.log(`Sending notification email for: ${key}`);
    sendNotificationEmail(key, userProfile.email, userProfile.name);
  } else {
    console.log(`Preference ${key} deactivated`);
    toast({
      title: "Preferência desativada",
      description: `A opção de ${getPreferenceLabel(key)} foi desativada.`
    });
  }
  
  // Save the updated preferences
  await saveSettings();
};
