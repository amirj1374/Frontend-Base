import '@/scss/style.scss';
import { bootstrapApplication } from '@/app/bootstrap';
import { mountFatalError } from '@/app/fatalError';
import { fakeBackend } from '@/utils/helpers/fake-backend';

if (import.meta.env.DEV) fakeBackend();

void bootstrapApplication().catch(mountFatalError);
