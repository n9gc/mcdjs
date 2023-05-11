# Aocudeo

*An Organizer of Code Units that Depend on Each Other* - *Aocudeo*, can load your interdependent modules with the correct order through the dependency list registered by each of modules.
It can also be used to organize your pipelining work.

## How to Load Your Modules

1. Get a public loader for your modules.

   ```ts
   import Loader from 'aocudeo';

   export const loader = new Loader();
   ```

2. Use loader's APIs to register the module ID and dependencies' ID in each of your modules.

   Such as:

   ```ts
   loader
     .insert('myMod', {
       after: ['toolMod', 'baseMod'],
       before: 'endMod',
     })
     .addAct('myMod', () => {
       console.log('Loading myMod');
     });
   ```

3. Run modules all.

4. ```ts
   loader.load();
   ```
