# Aocudeo

*An Organizer of Code Units that Depend on Each Other* - *Aocudeo*, can load your interdependent modules with the correct order through the dependency list of each of them.

## How to Load Your Modules

1. Using `new Loader();`, get a public loader for your modules.
2. Use loader's APIs to register the module ID and dependencies' ID in each of your modules.
3. Register modules all.
4. `loader.load();`
