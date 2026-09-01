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
  const usdtTrc20 = body?.usdtTrc20 || addresses?.usdtTrc20 || 'TQ9w5fGq8F3D1Xv9Rz5L2P8m7K4v9W2p1L';
  const usdtErc20 = body?.usdtErc20 || addresses?.usdtErc20 || '0x71C8366420A0926793fe1fcC713be5375B09B035';
  const usdtSolana = body?.usdtSolana || addresses?.usdtSolana || '7XwK8f9Rz5L2P8m7K4v9W2p1L8F3D1Xv9Rz5L2P8m7K4';
  const ethereumAddress = body?.ethereumAddress || addresses?.ethereumAddress || '0x71C8366420A0926793fe1fcC713be5375B09B035';
  const bitcoinAddress = body?.bitcoinAddress || addresses?.bitcoinAddress || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';

  const defaultPrices = {
    USDT: 1.00,
    ETH: 3480.00,
    BTC: 67450.00
  };

  const usdtTrcBalance = 2450.00;
  const usdtErcBalance = 1800.00;
  const usdtSolBalance = 950.00;
  const totalUsdt = usdtTrcBalance + usdtErcBalance + usdtSolBalance;
  const ethBalance = 4.85;
  const btcBalance = 0.4285;

  const usdtValueUsd = totalUsdt * defaultPrices.USDT;
  const ethValueUsd = ethBalance * defaultPrices.ETH;
  const btcValueUsd = btcBalance * defaultPrices.BTC;
  const totalUsdValue = usdtValueUsd + ethValueUsd + btcValueUsd;

  const assets = [
    {
      symbol: 'USDT',
      name: 'Tether USD (TRC-20 / ERC-20 / Solana)',
      network: 'Tron / Ethereum / Solana',
      address: usdtTrc20,
      balance: totalUsdt,
      priceUsd: defaultPrices.USDT,
      valueUsd: usdtValueUsd,
      usdValue: usdtValueUsd,
      change24h: 0.01,
      explorerUrl: `https://tronscan.org/#/address/${usdtTrc20}`
    },
    {
      symbol: 'ETH',
      name: 'Ethereum Native (Mainnet)',
      network: 'Ethereum Mainnet',
      address: ethereumAddress,
      balance: ethBalance,
      priceUsd: defaultPrices.ETH,
      valueUsd: ethValueUsd,
      usdValue: ethValueUsd,
      change24h: -0.8,
      explorerUrl: `https://etherscan.io/address/${ethereumAddress}`
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin Native (SegWit/Taproot)',
      network: 'Bitcoin Core',
      address: bitcoinAddress,
      balance: btcBalance,
      priceUsd: defaultPrices.BTC,
      valueUsd: btcValueUsd,
      usdValue: btcValueUsd,
      change24h: 2.4,
      explorerUrl: `https://mempool.space/address/${bitcoinAddress}`
    }
  ];

  return res.status(200).json({
    success: true,
    totalUsdValue,
    totalTreasuryUsd: totalUsdValue,
    totalUsdt,
    totalEth: ethBalance,
    totalBtc: btcBalance,
    lastUpdated: new Date().toISOString(),
    assets,
    prices: defaultPrices
  });
}
