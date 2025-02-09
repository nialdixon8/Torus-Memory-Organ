# Command Line Interface (CLI) Documentation

This document provides an overview of the CLI commands available for interacting with the database and network. The CLI enables users to perform administrative tasks, manage data, and inspect the database and network details.

## Overview

The CLI is designed to:
- Grant and revoke permissions
- Upload, query, and delete data
- Fetch database and network information

To start the CLI, execute the corresponding script in your terminal.

## Available Commands

### **Admin Commands:**

- **`grant <permission> <identity>`**  
  Grants a specific permission (e.g., `write`) to an identity.  
  **Usage:** `grant write <identity_id>`

- **`revoke <permission> <identity>`**  
  Revokes a specific permission from an identity.  
  **Usage:** `revoke write <identity_id>`

### **Write Commands:**

- **`create <path-to-json>`**  
  Uploads JSON data from a specified file path to the database.  
  **Usage:** `create ./data.json`

- **`delete <id>`**  
  Deletes a document from the database using its ID.  
  **Usage:** `delete <document_id>`

### **Read Commands:**

- **`query <field> <value>`**  
  Queries the database for documents where the specified field matches the given value.  
  **Usage:** `query name John`

- **`fetch <id>`**  
  Fetches a specific document from the database using its ID.  
  **Usage:** `fetch <document_id>`

- **`capabilities`**  
  Displays the database's current access capabilities.  
  **Usage:** `capabilities`

- **`list`**  
  Lists all documents currently stored in the database.  
  **Usage:** `list`

- **`info`**  
  Displays the database address and network addresses.  
  **Usage:** `info`

- **`id`**  
  Displays this node's public key (identity ID).  
  **Usage:** `id`

- **`con`**  
  Prints the connection string for peer-to-peer networking.  
  **Usage:** `con`

### **General Commands:**

- **`help`**  
  Displays a list of available commands with descriptions.  
  **Usage:** `help`

- **`exit`**  
  Exits the CLI interface gracefully.  
  **Usage:** `exit`

## Examples

1. **Grant Write Access:**  
   `grant write QmXYZ123abc`

2. **Upload JSON Data:**  
   `create ./data/users.json`

3. **Query for a Specific User:**  
   `query username johndoe`

4. **Delete a Document:**  
   `delete 2025-02-09T10:00:00.000Z`

5. **View Network Information:**  
   `info`

## Error Handling

- **Missing Arguments:** Commands like `grant`, `revoke`, and `create` require specific arguments. If missing, the CLI will display the correct usage format.
- **Invalid JSON:** For the `create` command, ensure the JSON file is correctly formatted to avoid parsing errors.
- **Permission Errors:** If the identity does not have sufficient permissions, commands like `grant` or `revoke` will return an error.

## Notes

- Use the `help` command at any time to review command options.
- Commands are case-sensitive.
- Ensure the database is connected and the network is active for all read/write operations.


