# R3mFinancasFront

This project is a personal financial management system that allows users to control financial transactions, bank institutions, expense/income categories, and accounting periods. Below is a non-technical description of all system features and the automatic versioning process.

## System Features

- **Transaction View**: List all financial transactions (income and expenses) for a bank institution, filtering by institution and period. Users can see details such as date, description, and amount for each transaction.

- **Add New Transaction**: Add a new financial transaction by entering the date, description, amount, category, institution, and corresponding period. The value can be entered simply, and the system automatically formats it.

- **Institution Management**: View and select different bank institutions, see the updated balance of each, and their associated transactions.

- **Category Management**: Transactions can be categorized (e.g., food, transport, etc.), making it easier to control and analyze expenses and income. The system allows listing, searching, and filtering categories.

- **Period Management**: Select periods (e.g., months of the year) to filter and view transactions and balances for each period. The system automatically identifies the current period based on the date.

- **Manual List Updates**: Manually update the lists of institutions, categories, and periods to ensure information is always up to date.

- **Copy Transactions**: Copy all transactions from an institution to the clipboard, making it easy to share or export data in text format.

- **Intuitive Interface**: The interface is divided into two main areas: one for listing and filtering transactions and another for adding new transactions, making usage simple and straightforward.

- **Error and Success Messages**: The system displays clear messages to the user in case of success or failure in operations, such as when adding a transaction or loading lists.

- **Smart Sorting**: Transactions are displayed sorted by date, value, and description, making it easier to view the most relevant entries.

- **Automatic Period Filling**: When entering the date of a transaction, the system automatically identifies the corresponding period.

- **Automatic Value Formatting**: The value field accepts simple numbers and automatically converts them to the Brazilian currency format, including negative values.

## Automatic Versioning and Automated Tests

The project uses GitHub Actions to automate the versioning process and ensure code quality. For every change pushed to the main branch:

- The system automatically installs dependencies, builds the project, and runs automated (unit) tests in a controlled environment.
- If all tests pass, the system uses an automatic versioning tool (GitVersion) to generate a new project version based on semantic versioning rules.
- A new tag is created in the repository and a release is published automatically on GitHub, making it easy to track versions and enable continuous delivery.

These processes ensure the system is always tested, versioned, and ready to be used or published.

## How to Use

1. **List Transactions**: Select the desired institution and period to view the transactions and corresponding balance.
2. **Add Transaction**: Fill in the form with the transaction data and click "Add Transaction".
3. **Update Lists**: Use the update buttons next to the selection fields to ensure the lists are up to date.
4. **Copy Transactions**: Click the copy icon to copy the transactions from the selected institution.
