import { connectDB } from '@database';

import { app } from './app';
import { PORT } from './config';

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🖲️  Server running at http://localhost:${PORT} 🖲️`);
  });
});
