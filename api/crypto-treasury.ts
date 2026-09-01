export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {}
  }

  const { addresses } = body || {};

  const defaultPrices = {
    USDT: 1.00,
    ETH: 3150.00,
    BTC: 89400.00
  };

  const assets = [
    {
      symbol: 'USDT',
      network: 'TRON (TRC20)',
      name: 'Tether USD',
      address: addresses?.usdtTrc20 || 'TQ9w5fGq8F3D1Xv9Rz5L2P8m7K4v9W2p1L',
      balance: 14250.00,
      usdValue: 14250.00,
      lastTx: '2 hrs ago',
      verified: true
    },
    {
      symbol: 'USDT',
      network: 'Ethereum (ERC20)',
      name: 'Tether USD',
      address: addresses?.usdtErc20 || '0x71C8366420A0926793fe1fcC713be5375B09B035',
      balance: 8600.00,
      usdValue: 8600.00,
      lastTx: '5 hrs ago',
      verified: true
    },
    {
      symbol: 'USDT',
      network: 'Solana (SPL)',
      name: 'Tether USD',
      address: addresses?.usdtSolana || '7XwK8f9Rz5L2P8m7K4v9W2p1L8F3D1Xv9Rz5L2P8m7K4',
      balance: 3400.00,
      usdValue: 3400.00,
      lastTx: '1 day ago',
      verified: true
    },
    {
      symbol: 'ETH',
      network: 'Ethereum Mainnet',
      name: 'Ethereum Native',
      address: addresses?.ethereumAddress || '0x71C8366420A0926793fe1fcC713be5375B09B035',
      balance: 2.85,
      usdValue: 2.85 * defaultPrices.ETH,
      lastTx: '3 hrs ago',
      verified: true
    },
    {
      symbol: 'BTC',
      network: 'Bitcoin Native (SegWit)',
      name: 'Bitcoin Native',
      address: addresses?.bitcoinAddress || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      balance: 0.285,
      usdValue: 0.285 * defaultPrices.BTC,
      lastTx: 'Yesterday',
      verified: true
    }
  ];

  const totalTreasuryUsd = assets.reduce((sum, a) => sum + a.usdValue, 0);

  return res.status(200).json({
    success: true,
    totalTreasuryUsd,
    assets,
    prices: defaultPrices,
    updatedAt: new Date().toISOString()
  });
}
