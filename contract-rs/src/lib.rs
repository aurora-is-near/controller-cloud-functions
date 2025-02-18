use near_plugins::{access_control, pause, AccessControlRole, AccessControllable, Pausable};
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, log, near, AccountId, PanicOnDefault};

/// Define roles for access control of `Pausable` features. Accounts which are
/// granted a role are authorized to execute the corresponding action.
#[derive(AccessControlRole, Deserialize, Serialize, Copy, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum Role {
    /// May pause and unpause features.
    PauseManager,
}

// Define the contract structure
#[access_control(role_type(Role))]
#[near(contract_state)]
#[derive(Pausable, PanicOnDefault)]
#[pausable(manager_roles(Role::PauseManager))]
pub struct Counter {
    val: i8,
}

// Implement the contract structure
#[near]
impl Counter {
    #[init]
    pub fn new(pause_manager: Option<AccountId>) -> Self {
        let mut contract = Self { val: 0 };

        // Make the contract itself super admin. This allows us to grant any role in the
        // constructor.
        near_sdk::require!(
            contract.acl_init_super_admin(env::current_account_id()),
            "Failed to initialize super admin",
        );

        if let Some(account_id) = pause_manager {
            // Grant `Role::PauseManager` to the provided account.
            let result = contract.acl_grant_role(Role::PauseManager.into(), account_id);
            near_sdk::require!(Some(true) == result, "Failed to grant role");
        }

        contract
    }

    // Public read-only method: Returns the counter value.
    pub fn get_num(&self) -> i8 {
        self.val
    }

    // Public method: Increment the counter.
    #[pause]
    pub fn increment(&mut self, number: Option<i8>) {
        self.val += number.unwrap_or(1);
        log!("Increased number to {}", self.val);
    }

    // Public method: Decrement the counter.
    #[pause]
    pub fn decrement(&mut self, number: Option<i8>) {
        self.val -= number.unwrap_or(1);
        log!("Decreased number to {}", self.val);
    }

    // Public method - Reset to zero.
    #[pause]
    pub fn reset(&mut self) {
        self.val = 0;
        log!("Reset counter to zero");
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * to run these, the command will be: `cargo test`
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn increment() {
        // instantiate a contract variable with the counter at zero
        let mut contract = Counter { val: 0 };
        contract.increment(None);
        assert_eq!(1, contract.get_num());
    }

    #[test]
    fn increment_with_points() {
        // instantiate a contract variable with the counter at zero
        let mut contract = Counter { val: 0 };
        contract.increment(Some(10));
        assert_eq!(10, contract.get_num());
    }

    #[test]
    fn decrement() {
        let mut contract = Counter { val: 0 };
        contract.decrement(None);
        assert_eq!(-1, contract.get_num());
    }

    #[test]
    fn decrement_with_points() {
        // instantiate a contract variable with the counter at zero
        let mut contract = Counter { val: 0 };
        contract.decrement(Some(10));
        assert_eq!(-10, contract.get_num());
    }

    #[test]
    fn increment_and_reset() {
        let mut contract = Counter { val: 0 };
        contract.increment(None);
        contract.reset();
        assert_eq!(0, contract.get_num());
    }

    #[test]
    #[should_panic]
    fn panics_on_overflow() {
        let mut contract = Counter { val: 127 };
        contract.increment(None);
    }

    #[test]
    #[should_panic]
    fn panics_on_underflow() {
        let mut contract = Counter { val: -128 };
        contract.decrement(None);
    }
}
