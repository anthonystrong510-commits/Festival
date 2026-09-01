import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocFromServer,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  where,
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  VendorApplicationRecord, 
  AttendeeRsvpRecord, 
  FestivalConfigData, 
  EmailTemplateData, 
  SmtpConfigData,
  OutboundEmailLog,
  PaymentConfig,
  Invoice,
  InvoiceStatus,
  InvoicePaymentSubmission
} from '../types';
import { EVENT_CONFIG } from '../data/festivalData';
import { DEFAULT_EMAIL_TEMPLATES } from '../data/defaultEmailTemplates';

// 1. Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

// 2. Error Handler Schema according to Firebase Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 3. Test Connection
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'festival_config', 'settings'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting.');
    }
    return false;
  }
}

// 4. Vendor Applications API
export async function createVendorApplication(data: Omit<VendorApplicationRecord, 'id' | 'createdAt' | 'status'> & { id?: string }): Promise<string> {
  const applicationId = data.id || `app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const path = `vendor_applications/${applicationId}`;
  
  const payload: VendorApplicationRecord = {
    ...data,
    id: applicationId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentStatus: 'unpaid'
  };

  try {
    await setDoc(doc(db, 'vendor_applications', applicationId), payload);
    return applicationId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeVendorApplications(callback: (apps: VendorApplicationRecord[]) => void) {
  const q = query(collection(db, 'vendor_applications'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: VendorApplicationRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<VendorApplicationRecord, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.error('Snapshot error for vendor_applications:', error);
      callback([]);
    }
  );
}

export async function updateVendorApplicationStatus(
  id: string, 
  updates: Partial<VendorApplicationRecord>
): Promise<void> {
  const path = `vendor_applications/${id}`;
  try {
    await updateDoc(doc(db, 'vendor_applications', id), {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteVendorApplication(id: string): Promise<void> {
  const path = `vendor_applications/${id}`;
  try {
    await deleteDoc(doc(db, 'vendor_applications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. Attendee RSVPs API
export async function createAttendeeRsvp(data: Omit<AttendeeRsvpRecord, 'id' | 'createdAt' | 'checkedIn' | 'passCode'>): Promise<string> {
  const rsvpId = `rsvp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const passCode = `PASS-${Math.floor(100000 + Math.random() * 900000)}`;
  const path = `attendee_rsvps/${rsvpId}`;

  const payload: AttendeeRsvpRecord = {
    ...data,
    id: rsvpId,
    passCode,
    checkedIn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'attendee_rsvps', rsvpId), payload);
    return passCode;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeAttendeeRsvps(callback: (rsvps: AttendeeRsvpRecord[]) => void) {
  const q = query(collection(db, 'attendee_rsvps'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AttendeeRsvpRecord[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<AttendeeRsvpRecord, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.error('Snapshot error for attendee_rsvps:', error);
      callback([]);
    }
  );
}

export async function toggleAttendeeCheckIn(id: string, checkedIn: boolean): Promise<void> {
  const path = `attendee_rsvps/${id}`;
  try {
    await updateDoc(doc(db, 'attendee_rsvps', id), {
      checkedIn,
      checkedInAt: checkedIn ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAttendeeRsvp(id: string): Promise<void> {
  const path = `attendee_rsvps/${id}`;
  try {
    await deleteDoc(doc(db, 'attendee_rsvps', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Email Templates API
export function subscribeEmailTemplates(callback: (templates: EmailTemplateData[]) => void) {
  const colRef = collection(db, 'email_templates');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // Seed default templates if empty
        seedDefaultEmailTemplates().then(() => {
          callback(DEFAULT_EMAIL_TEMPLATES);
        });
        return;
      }
      const list: EmailTemplateData[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<EmailTemplateData, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.warn('Using default email templates due to snapshot listener:', error);
      callback(DEFAULT_EMAIL_TEMPLATES);
    }
  );
}

export async function saveEmailTemplate(template: EmailTemplateData): Promise<void> {
  const path = `email_templates/${template.id}`;
  try {
    await setDoc(doc(db, 'email_templates', template.id), {
      ...template,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultEmailTemplates(): Promise<void> {
  try {
    for (const tmpl of DEFAULT_EMAIL_TEMPLATES) {
      await setDoc(doc(db, 'email_templates', tmpl.id), {
        ...tmpl,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn('Note: Default templates ready in memory:', err);
  }
}

export async function getEmailTemplateByKey(keyOrId: string): Promise<EmailTemplateData | null> {
  try {
    const snap = await getDoc(doc(db, 'email_templates', keyOrId));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as EmailTemplateData) };
    }
  } catch (err) {
    console.warn('Could not fetch template from Firestore, using memory fallback:', err);
  }
  return DEFAULT_EMAIL_TEMPLATES.find(t => t.id === keyOrId || t.key === keyOrId) || null;
}

export async function getSmtpConfigOnce(): Promise<SmtpConfigData> {
  try {
    const snap = await getDoc(doc(db, 'email_config', 'smtp_settings'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as SmtpConfigData) };
    }
  } catch (err) {
    console.warn('Could not fetch SMTP settings from Firestore, using memory fallback:', err);
  }
  return DEFAULT_SMTP_CONFIG;
}

export async function getFestivalConfigOnce(): Promise<FestivalConfigData> {
  try {
    const snap = await getDoc(doc(db, 'festival_config', 'main_event'));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as FestivalConfigData) };
    }
  } catch (err) {
    console.warn('Could not fetch Festival config from Firestore, using memory fallback:', err);
  }
  return DEFAULT_FESTIVAL_CONFIG;
}

// 7. SMTP Settings API
export const DEFAULT_SMTP_CONFIG: SmtpConfigData = {
  id: 'main_smtp',
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  username: 'apikey',
  password: '',
  fromName: 'Columbia Community Festival Operations',
  fromEmail: 'events@festivalmarket.org',
  replyToEmail: 'inquiries@festivalmarket.org',
  rateLimitPerHour: 250,
  spfRecord: 'v=spf1 include:sendgrid.net ~all',
  dkimSelector: 's1._domainkey.festivalmarket.org',
  dmarcPolicy: 'v=DMARC1; p=quarantine; pct=100',
  isEnabled: true,
  testStatus: 'idle',
  updatedAt: new Date().toISOString()
};

export function subscribeSmtpConfig(callback: (config: SmtpConfigData) => void) {
  const docRef = doc(db, 'email_config', 'smtp_settings');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as SmtpConfigData) });
      } else {
        // Save initial default
        saveSmtpConfig(DEFAULT_SMTP_CONFIG).then(() => {
          callback(DEFAULT_SMTP_CONFIG);
        });
      }
    },
    (error) => {
      console.warn('Using default SMTP settings:', error);
      callback(DEFAULT_SMTP_CONFIG);
    }
  );
}

export async function saveSmtpConfig(config: SmtpConfigData): Promise<void> {
  const path = 'email_config/smtp_settings';
  try {
    await setDoc(doc(db, 'email_config', 'smtp_settings'), {
      ...config,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 7.1 Outbound Email Logs API
export async function logOutboundEmail(logData: OutboundEmailLog): Promise<void> {
  const logId = logData.id || `mail-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const path = `outbound_email_logs/${logId}`;
  try {
    await setDoc(doc(db, 'outbound_email_logs', logId), {
      ...logData,
      id: logId,
      sentAt: logData.sentAt || new Date().toISOString()
    });
  } catch (error) {
    console.warn('Note: Could not write email log to Firestore:', error);
  }
}

export function subscribeOutboundEmailLogs(callback: (logs: OutboundEmailLog[]) => void) {
  const q = query(collection(db, 'outbound_email_logs'), orderBy('sentAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: OutboundEmailLog[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as Omit<OutboundEmailLog, 'id'>) });
      });
      callback(list);
    },
    (error) => {
      console.warn('Snapshot error for outbound_email_logs:', error);
      callback([]);
    }
  );
}

export async function deleteOutboundEmailLog(id: string): Promise<void> {
  const path = `outbound_email_logs/${id}`;
  try {
    await deleteDoc(doc(db, 'outbound_email_logs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 8. Festival Settings API
export const DEFAULT_FESTIVAL_CONFIG: FestivalConfigData = {
  id: 'settings',
  name: EVENT_CONFIG.name,
  shortName: EVENT_CONFIG.shortName,
  heroHeadline: EVENT_CONFIG.heroHeadline,
  edition: EVENT_CONFIG.edition,
  tagline: EVENT_CONFIG.tagline,
  description: EVENT_CONFIG.description,
  venueName: EVENT_CONFIG.venueName,
  venueArea: EVENT_CONFIG.venueArea,
  address: EVENT_CONFIG.address,
  cityState: EVENT_CONFIG.cityState,
  fullLocation: EVENT_CONFIG.fullLocation,
  mapQuery: EVENT_CONFIG.mapQuery,
  datesSummary: EVENT_CONFIG.datesSummary,
  durationBadge: EVENT_CONFIG.durationBadge,
  admissionBadge: EVENT_CONFIG.admissionBadge,
  locationBadge: EVENT_CONFIG.locationBadge,
  contactEmail: 'organizers@festivalmarket.org',
  freeAdmission: true,
  active: true,
  updatedAt: new Date().toISOString()
};

export function subscribeFestivalConfig(callback: (config: FestivalConfigData) => void) {
  const docRef = doc(db, 'festival_config', 'settings');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as FestivalConfigData) });
      } else {
        saveFestivalConfig(DEFAULT_FESTIVAL_CONFIG).then(() => {
          callback(DEFAULT_FESTIVAL_CONFIG);
        });
      }
    },
    (error) => {
      console.warn('Using default festival config:', error);
      callback(DEFAULT_FESTIVAL_CONFIG);
    }
  );
}

export async function saveFestivalConfig(config: FestivalConfigData): Promise<void> {
  const path = 'festival_config/settings';
  try {
    await setDoc(doc(db, 'festival_config', 'settings'), {
      ...config,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 9. Auth Helper Functions
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

export async function adminSignOut(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// 10. Demo Seed Generator for Sample Applications & RSVPs (for initial exploration)
export async function seedSampleData(): Promise<{ apps: number; rsvps: number }> {
  const sampleApps: Partial<VendorApplicationRecord>[] = [
    {
      id: 'app-sample-1',
      businessName: 'Artisan Silver & Gem Studio',
      contactName: 'Nadia Solis',
      email: 'nadia@artisansilver.com',
      phone: '(555) 349-2810',
      website: 'https://instagram.com/artisansilver',
      category: 'Jewelry & Metalsmithing',
      selectedBoothId: 'corner-10x10',
      selectedDays: ['fri', 'sat', 'sun'],
      productDescription: 'Hand-forged recycled sterling silver jewelry set with raw turquoise, crystals, and moonstones.',
      photoLinks: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
      isFoodVendor: false,
      hasFoodPermit: false,
      tempHygieneCompliant: false,
      needsHandicapParking: false,
      handicapNotes: '',
      additionalRequests: 'Near morning shade if possible',
      agreedToTerms: true,
      status: 'approved',
      totalCalculatedFee: 375,
      boothZoneAssignment: 'Central Marketplace Corners - Booth C-104',
      adminNotes: 'Excellent quality portfolio. Approved for 3-day corner spot.',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'app-sample-2',
      businessName: 'Botanicals & Herbal Apothecary',
      contactName: 'Elena Vance',
      email: 'elena@botanicalapothecary.com',
      phone: '(555) 782-9912',
      website: 'https://botanicalapothecary.com',
      category: 'Beauty & Wellness',
      selectedBoothId: 'tent-10x10',
      selectedDays: ['sat', 'sun'],
      productDescription: 'Small-batch organic lavender soaps, herbal salves, and hand-poured botanical soy candles.',
      photoLinks: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
      isFoodVendor: false,
      hasFoodPermit: false,
      tempHygieneCompliant: false,
      needsHandicapParking: true,
      handicapNotes: 'Requires close vehicle unloading proximity for heavy candle crates',
      additionalRequests: '',
      agreedToTerms: true,
      status: 'pending',
      totalCalculatedFee: 200,
      boothZoneAssignment: 'Artisan Promenade Row - Booth A-202',
      adminNotes: 'Reviewing accessibility parking gate pass.',
      paymentStatus: 'unpaid',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'app-sample-3',
      businessName: 'Smoked Heritage BBQ & Grill',
      contactName: 'Marcus & Tara Ray',
      email: 'marcus@smokedheritagebbq.com',
      phone: '(555) 912-4450',
      website: 'https://smokedheritagebbq.com',
      category: 'Culinary, Baked Goods & Spices',
      selectedBoothId: 'food-truck',
      selectedDays: ['fri', 'sat', 'sun'],
      productDescription: 'Slow-smoked brisket platters, peach BBQ wings, loaded mac & cheese, and fresh lemonade.',
      photoLinks: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb',
      isFoodVendor: true,
      hasFoodPermit: true,
      tempHygieneCompliant: true,
      needsHandicapParking: false,
      handicapNotes: '',
      additionalRequests: 'Requires 220V 50A hookup or quiet onboard generator clearance',
      agreedToTerms: true,
      status: 'approved',
      totalCalculatedFee: 570,
      boothZoneAssignment: 'Dining Promenade & Food Truck Row - Bay FT-02',
      adminNotes: 'Permit valid and verified. Power hookup allocated.',
      paymentStatus: 'paid',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ];

  const sampleRsvps: Partial<AttendeeRsvpRecord>[] = [
    {
      id: 'rsvp-sample-1',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      daysAttending: ['fri', 'sat'],
      interests: ['Artisan Crafts & Handmade Goods', 'Gourmet Food Trucks & Flavors', 'Live Stage Performances'],
      groupSize: 3,
      newsletterOptIn: true,
      checkedIn: false,
      passCode: 'PASS-892104',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'rsvp-sample-2',
      name: 'David & Emily Ross',
      email: 'david.ross@example.com',
      daysAttending: ['sat', 'sun'],
      interests: ['Culinary, Baked Goods & Spices', 'Kids & Family Activities'],
      groupSize: 4,
      newsletterOptIn: true,
      checkedIn: true,
      checkedInAt: new Date(Date.now() - 1800000).toISOString(),
      passCode: 'PASS-441920',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'rsvp-sample-3',
      name: 'Michael Chen',
      email: 'mchen@example.org',
      daysAttending: ['sun'],
      interests: ['Handmade Jewelry & Accessories', 'Home Goods, Ceramics & Woodcraft'],
      groupSize: 2,
      newsletterOptIn: false,
      checkedIn: false,
      passCode: 'PASS-773192',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  let appCount = 0;
  let rsvpCount = 0;

  for (const a of sampleApps) {
    try {
      await setDoc(doc(db, 'vendor_applications', a.id!), a);
      appCount++;
    } catch (e) {
      console.warn('Sample app write:', e);
    }
  }

  for (const r of sampleRsvps) {
    try {
      await setDoc(doc(db, 'attendee_rsvps', r.id!), r);
      rsvpCount++;
    } catch (e) {
      console.warn('Sample rsvp write:', e);
    }
  }

  return { apps: appCount, rsvps: rsvpCount };
}

// -------------------------------------------------------------
// PAYMENT GATEWAY & CRYPTO ADDRESSES (USDT, ETH, BTC, KRAKEN, CASHAPP)
// -------------------------------------------------------------

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  id: 'main_payment_config',
  usdtTrc20: 'TQ9w5fGq8F3D1Xv9Rz5L2P8m7K4v9W2p1L',
  usdtErc20: '0x71C8366420A0926793fe1fcC713be5375B09B035',
  usdtSolana: '7XwK8f9Rz5L2P8m7K4v9W2p1L8F3D1Xv9Rz5L2P8m7K4',
  ethereumAddress: '0x71C8366420A0926793fe1fcC713be5375B09B035',
  ethereumEns: 'columbiafestival.eth',
  bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  bitcoinLightning: 'columbiafestival@strike.me',
  cashAppCashtag: '$ColumbiaFestival',
  cashAppBtcAddress: 'bc1q9v8u5h2x3k4p5w6q7r8s9t0u1v2w3x4y5z6a7b',
  cashAppEnabled: true,
  krakenPayId: 'KRAKEN-COLUMBIA-FEST-882',
  krakenDepositAddress: '0x71C8366420A0926793fe1fcC713be5375B09B035',
  krakenSponsorBadgeEnabled: true,
  bankName: 'First Columbia Community Bank',
  bankAccountName: 'Columbia Market Association LLC',
  bankAccountNumber: '••••••••4892',
  bankRoutingNumber: '121000358',
  bankSwiftBic: 'FCBKUS33',
  zelleHandle: 'treasury@columbiamarket.org',
  paymentInstructions: 'Please include your Invoice # in the transaction memo or note. For on-chain cryptocurrency payments, paste your transaction hash (TxID) in the checkout receipt portal to confirm instant booth assignment.',
  updatedAt: new Date().toISOString()
};

export async function getPaymentConfig(): Promise<PaymentConfig> {
  try {
    const docRef = doc(db, 'payment_config', 'main_payment_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_PAYMENT_CONFIG, ...snap.data(), id: 'main_payment_config' } as PaymentConfig;
    }
    // Bootstrap initial config
    await setDoc(docRef, DEFAULT_PAYMENT_CONFIG);
    return DEFAULT_PAYMENT_CONFIG;
  } catch (error) {
    console.error('Error fetching payment config:', error);
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export async function savePaymentConfig(config: Partial<PaymentConfig>): Promise<PaymentConfig> {
  try {
    const docRef = doc(db, 'payment_config', 'main_payment_config');
    const payload = {
      ...config,
      id: 'main_payment_config',
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return payload as PaymentConfig;
  } catch (error) {
    console.error('Error saving payment config:', error);
    throw error;
  }
}

export function subscribePaymentConfig(callback: (config: PaymentConfig) => void): () => void {
  const docRef = doc(db, 'payment_config', 'main_payment_config');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_PAYMENT_CONFIG, ...snap.data(), id: 'main_payment_config' } as PaymentConfig);
      } else {
        callback(DEFAULT_PAYMENT_CONFIG);
      }
    },
    (err) => {
      console.warn('Payment config snapshot error:', err);
      callback(DEFAULT_PAYMENT_CONFIG);
    }
  );
}

// -------------------------------------------------------------
// INVOICES & CHECKOUT
// -------------------------------------------------------------

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
}

export async function getInvoiceById(invoiceId: string): Promise<Invoice | null> {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Invoice;
    }
    // Also try search by invoiceNumber
    const q = query(collection(db, 'invoices'), where('invoiceNumber', '==', invoiceId), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return { id: querySnap.docs[0].id, ...querySnap.docs[0].data() } as Invoice;
    }
    return null;
  } catch (error) {
    console.error('Error getting invoice by id:', error);
    return null;
  }
}

export async function saveInvoice(invoice: Partial<Invoice> & { recipientEmail: string; totalAmount: number }): Promise<Invoice> {
  try {
    const id = invoice.id || `inv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const invoiceNumber = invoice.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const fullInvoice: Invoice = {
      id,
      invoiceNumber,
      vendorApplicationId: invoice.vendorApplicationId || '',
      recipientBusinessName: invoice.recipientBusinessName || 'Valued Vendor',
      recipientContactName: invoice.recipientContactName || 'Vendor Representative',
      recipientEmail: invoice.recipientEmail,
      recipientPhone: invoice.recipientPhone || '',
      recipientAddress: invoice.recipientAddress || '',
      issueDate: invoice.issueDate || now.split('T')[0],
      dueDate: invoice.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invoice.status || 'draft',
      items: invoice.items || [],
      subtotal: invoice.subtotal || invoice.totalAmount,
      discountAmount: invoice.discountAmount || 0,
      taxAmount: invoice.taxAmount || 0,
      totalAmount: invoice.totalAmount,
      paidAmount: invoice.paidAmount || 0,
      currency: invoice.currency || 'USD',
      notes: invoice.notes || 'Thank you for participating in the Columbia Community Vendor Marketplace!',
      terms: invoice.terms || 'Payment is due within 14 days of receipt to guarantee reserved booth space and electrical allocations.',
      cryptoAddresses: invoice.cryptoAddresses,
      paymentDetailsSubmitted: invoice.paymentDetailsSubmitted,
      sentAt: invoice.sentAt,
      paidAt: invoice.paidAt,
      checkoutUrl: invoice.checkoutUrl || `${window.location.origin}/?invoice=${id}`,
      createdAt: invoice.createdAt || now,
      updatedAt: now
    };

    await setDoc(doc(db, 'invoices', id), fullInvoice, { merge: true });
    return fullInvoice;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus, paidAmount?: number): Promise<void> {
  try {
    const docRef = doc(db, 'invoices', id);
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString()
    };
    if (status === 'paid') {
      updateData.paidAt = new Date().toISOString();
      if (paidAmount !== undefined) {
        updateData.paidAmount = paidAmount;
      }
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
}

export async function submitInvoicePaymentProof(
  invoiceId: string, 
  submission: InvoicePaymentSubmission
): Promise<void> {
  try {
    const docRef = doc(db, 'invoices', invoiceId);
    await updateDoc(docRef, {
      status: 'under_review',
      paymentDetailsSubmitted: submission,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting payment proof:', error);
    throw error;
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'invoices', id));
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}

export function subscribeInvoices(callback: (invoices: Invoice[]) => void): () => void {
  const q = query(collection(db, 'invoices'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
      callback(items);
    },
    (err) => {
      console.warn('Invoices snapshot error:', err);
      callback([]);
    }
  );
}
