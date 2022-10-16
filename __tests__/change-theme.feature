Feature: Switch a theme

  In order to see the theme I like
  As a User
  I want to be able to switch themes

  Scenario Outline: Switch theme
  Given Current theme is <CurrentTheme>
  When User switches a theme
  Then System shows a <NewTheme>

  Examples:
      | CurrentTheme          | NewTheme    |
      |-----------------------|-------------|
      | light theme (default) | dark theme  |
      | dark theme            | light theme |