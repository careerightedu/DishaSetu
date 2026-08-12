"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";

type Dictionary = Record<string, Record<string, string>>;

export function useTranslations(namespace?: string) {
  const { profile } = useAuth();
  const isHindi = profile?.languagePreference === "Hindi";
  const messages = (isHindi ? hiMessages : enMessages) as Dictionary;

  const t = (key: string) => {
    // If a namespace is provided, the key could be just "title", but we support "Namespace.title" format
    let lookupKey = key;
    if (namespace && !key.includes('.')) {
      lookupKey = `${namespace}.${key}`;
    } else if (namespace && key.startsWith(`${namespace}.`)) {
      lookupKey = key;
    }

    const [group, item] = lookupKey.split(".");
    
    if (messages[group] && messages[group][item]) {
      return messages[group][item];
    }
    
    return key; // Fallback to key if translation is missing
  };

  return t;
}
