module.exports = {
  extends: [
    "airbnb",
    "airbnb/hooks",
    "inrupt-base",
  ],

  plugins: [
    "react",
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    // Use .tsx for jsx files
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],

    // Import react by default via webpack config
    "react/react-in-jsx-scope": 0,

    // Order the properties of react components nicely
    "react/static-property-placement": [2, "static public field"],

    // Allow Nextjs <Link> tags to contain a href attribute
    "jsx-a11y/anchor-is-valid": ["error", {
      "components": ["Link"],
      "specialLink": ["hrefLeft", "hrefRight"],
      "aspects": ["invalidHref", "preferButton"]
    }],

    // Make everything work with .tsx as well as .ts
    "import/extensions": [2, {
      js: "never",
      ts: "never",
      tsx: "never",
    }],

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts", ".tsx"],
        },
      },
    },
  }
};
