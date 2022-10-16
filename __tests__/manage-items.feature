Feature: Manage items in the list

  Scenario: Default
  Given User opened the page
  Then Todo list is prefilled with default values

  Scenario Outline: Possibility to submit an item
  Given <StateOfInput>
  Then <SystemReaction>

  Examples:
      | StateOfInput          | SystemReaction          |
      |-----------------------|-------------------------|
      | Empty                 | Doesn't allow to submit |
      | Contains >= 1 symbols | Allows to submit        |


  Scenario Outline: Submit an item
  Given System allows to submit item
  And Current tab is <CurrentTab>
  When User submits item
  Then System clears the input
  And <SystemReaction>
  And Updates information in tabs

  Examples:
      | CurrentTab   | SystemReaction                                    |
      |--------------|---------------------------------------------------|
      | All / Active | Adds an uncheked input in the bottom of the list  |
      | Completed    | Does nothing                                      |

  Scenario Outline: Check item
  Given Current tab is <Tab>
  And Item is <ItemState>
  When User checks item
  Then <SystemReaction>
  And Updates information in tabs

  Examples:
      | Tab       | ItemState  | SystemReaction |
      |-----------|------------|----------------|
      | All       | Unchecked  | Check item     |
      | All       | Checked    | Uncheck item   |
      |-----------|------------|----------------|
      | Active    | Unchecked  | Hide item      |
      | Active    | Checked    | n/a            |
      |-----------|------------|----------------|
      | Completed | Unchecked  | n/a            |
      | Completed | Checked    | Hide item      |

  Scenario: Clear completed
  When User initiates clearing of completed items
  Then System hides checked items
  And System sets to zero number of completed items in tabs information

  Scenario: Delete item
  Given There are >=1 items in the list
  When User initiates deletion of item
  Then System hides item from list
  And System removes info about the deleted item from tabs information
  



