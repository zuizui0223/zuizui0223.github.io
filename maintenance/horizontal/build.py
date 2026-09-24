from pathlib import Path
import json
R=Path.cwd()
raw='''hotarubukuro f55c25df99efcb5cf5d44a76bdbafd914e4d3971 60
azami c03c25f17fbf2e578c1906a3e70c0211bfc9cf06 55
bita b9eb00a4c17e454f22a0c93e15492dca682087a9 75
island 66d4f81f72e641d36fc310f824ce8c15617bc307 55
mrod 665e07f8b7a92aca2ea40b915ff8a2aac52a5a89 44
pollipi 7375a7850ad0c48d1a56bb962a3130cd01e0d50e 28
insepi a0b29c487807d212be00743d80d3bd423a18cfb7 32
acsp 7787c6bc03b145e686dde2f03abd84343594c50e 50
egc 6b496b859e933c6a821d13ce1e04891cb9ea93d9 50
ccoc cca70df254fce8c597ae376a34a1fa2fbd8e9f56 33
izu-core 71a2cf698df59e9e83687d2427792f6b579cb0b4 60
egwe ac1f876e1c62248a499818f6237827c4396c3ade 65
mltr ecd0e289d80f6d95409b92802b3c5a62f2578913 38
ced 8a506a7b5a8619edea12cb98bbbfd275111bb4dc 38
mrm d3f0167c5d7dc4b756b017a3e04e563ee85c10fc 32
shimahotarubukuro 24135526e16b459b223ad9315254d8879bf8cb07 34
fcp 462e73ddc59026412ef36e640fa29a52392ceedb 65
eog 285397bf60080c8356507a3c0eb38e9fc95d2d64 55
odsp bf8dcf97bbe6036b1cd94572b71f654def4384e9 52
EAzami 19f39e75ce0abfae00d2b5ca9e6bb8f685f9d69d 60
chun 2dc710cbac8a223c9fc44aa09fef3c97ad6631a5 65
sdmr df323c224a4060dae6e0454db2022e0e986431f9 48
crest b86eb4ca345fce2e971c70c03f647ffce97d0abf 42
theouni 9f094d02d78f14524da6e9aba785b46470e2f175 30
tnoa 0049e3795701ceb2afa4ad7ce1ab7247a6e0558e 35
aza3 7398e2ff93511bd9099407437feb80db3c95e8ba 50
sch b47ebdb17308cb7ae4e374401112f4955f7c913d 65
boundary c0729112e4df1629c24d4cedd98a5fb7e23c3738 40
rec 319afc7899abc3ab1d2356563317fc4e73940bce 32
284b a5ca53b09aed0adaaebeff24602a58d833f7ac94 70
egwee bd6801aea6c14303d09a14ad338f1a660e88b77c 50
balance be6b5ad1b0b5edb7abd05c077a2f1e840fcf10be 55
v3 17f861103c36aa791a31c8ca8ffc0ecc3e77bed0 30
payoff 1b361d52062f539903a06070aa2faa629eae55a9 48
adaptive-gain 5411365095ec606cbfe1f032c51bbe59b438d296 40
TTF 41048213e098a6e3cdc700b84299736e7300f265 65
slk 192814b747f1b36b27478e48ace05f052bcce3a0 180
esdm 1051ebc8526fd7820faa063134ee397d2b3ceb57 150
iwe e239a76d424394ef6e8d46e06e33268d06f8b390 145
Structural d284df5fa6ec628aaa36734c58b234a058b7c02c 105'''
sources={}
for line in raw.splitlines():
    repo,sha,end=line.split();path='README.md';ref='main'
    if repo=='284b':path='docs/product_b_eog_sdmr_relation_space_alignment.md'
    if repo=='Structural':path='docs/STRUCTURAL_EGWE_TTF_HANDOFF_V0_34.md'
    if repo=='esdm':ref='e9d25912b7662d397c15b10f1851e1cc0108d8ea'
    sources[repo]={'repo':repo,'path':path,'blob':sha,'ref':ref,'read_lines':[1,int(end)],'url':f'https://github.com/zuizui0223/{repo}/blob/{ref}/{path}'}
roles={
'hotarubukuro':'ホタルブクロの地理的な花色変異。原点となる個体系。',
'fcp':'種内の花色分布と、その地理的な組織化。空間の側。',
'chun':'Camelliaの花色と色素経路の反復。進化時間の側。',
'azami':'現在のアザミ頭花を、連続的な形質と環境から読む。',
'EAzami':'アザミ頭花の進化的反復と、歴史的原因の識別限界。',
'aza3':'EAzamiで残る歴史を、同一個体に紐づく将来の一次データで分ける。',
'island':'島嶼で反復する繁殖保証と花の機能的組み合わせを問う。',
'izu-core':'出発状態と実現した送粉者群集による、条件付きの応答分岐。',
'shimahotarubukuro':'伊豆のシマホタルブクロに実現した形態差を測る。',
'pollipi':'花の訪問者を記録する装置。候補判定と一次画像を分ける。',
'insepi':'観測側の故障を介入で識別する。物理系での検証は別の段階。',
'rec':'露出が記録へ入る前の脱落。記録後の分類では戻せない情報。',
'v3':'保持した参照情報が、両立する解釈をどう絞るか。',
 'tnoa':'対象・外乱・観測可能性・保留を、意味付けで潰さず残す。',
'boundary':'いまの観測写像では、どの機構の区別が不可能か。',
'mrod':'未解決の機構を分けるために、次は何を測るか。',
'sdmr':'環境座標とモデルを、未見の出現記録で選ぶ。',
'odsp':'平面地図が落とす深さ・時間などの状態分布を問う。',
'eog':'観測と両立し、到達可能な分布世界を集合として残す。',
'284b':'異なる生物学的役割の答えを、共通の関係空間で照合する。',
'acsp':'次に調べる候補パッチを返す。存在・検出の保証ではない。',
'ccoc':'許される未来を広げたとき、圧縮が残すべき区別。',
'mltr':'系を置き換えたとき、状態の意味と履歴をどう運ぶか。',
'mrm':'同じ現在から違う未来を返す機構を、状態と実験で区別する。',
'crest':'未来・履歴・隠れた現在を踏まえ、必要な状態を定める。',
'ced':'必要な区別を、実際の証拠は報告できるほど識別したか。',
 'theouni':'世界・契約・必要状態・証拠と、研究プログラムの関係を整理する。',
'sch':'多機能性ではなく、共有形質の機能的対立を識別する。',
'balance':'対立はあっても分化が割に合わない、妥協領域の持続。',
'bita':'アクセス制約による利用経路の変更と、機構識別。SLKとは別軸。',
'payoff':'構造利得を集団・空間・時間へ運ぶ数学。SLKへの出典と独立拡張。',
'egc':'断片化で、生物学的な各状態が同じようには劣化しない条件。',
'egwe':'未来を分ける状態・作用過程・残存余力。有限モデルで問う。',
'egwee':'自然の断片化で、相互作用・繁殖・遺伝の応答を比較する。',
'TTF':'種内の転換構造が、未見の別種にも移るかを独立に検証する。',
'adaptive-gain':'途中の結果に合わせた測定選択は、固定測定よりどれだけ得か。',
'slk':'R−Kの構造価値を、到達可能性・侵入・固定・占有へつなぐ。',
'esdm':'生態過程→潜在状態→観測を、一つの生成モデルにする開発系。',
'iwe':'季節的な同調の繁殖効果を、相利・拮抗・混合系で比較する独立メタ解析。',
'Structural':'十分な参照を与えたあと、景観構造に予測上の情報が残るか。'}
links=[]
def link(a,b,kind,src,note,ceiling,status='documented'):
    links.append({'id':f'{a}--{b}','from':a,'to':b,'kind':kind,'status':status,'source':src,'note':note,'ceiling':ceiling,'scientific_edge':False})
link('sch','balance','handoff','balance','共有軸の対立Lと、分化が割に合わない領域を接続する。','Lの識別が先。多機能性だけでは対立を認定しない。')
link('sch','slk','handoff','slk','識別した対立負荷を、回復量R・費用Kの比較へ渡す。','R=sLは登録された二次モデル内の橋。普遍恒等式ではない。')
link('balance','slk','handoff','balance','L>0かつPhi<0の妥協領域を、構造価値の境界と照合する。','Phi>0でも局所到達・侵入・固定は別の条件。')
link('payoff','slk','provenance','slk','PAYOFFの数学的結果をSLKの進化的実現段階へ引き継ぐ。','独立な空間・季節拡張はPAYOFFに残る。リポの統合ではない。')
link('bita','slk','comparison','slk','機構の識別と、構造が割に合う条件を横に置いて比較する。','BITAは現在R/K/Phi境界の所有者ではない。')
link('bita','sch','comparison','slk','trait interactionとfunctional conflictを別の識別問題として扱う。','形質相互作用だけでは機構も共有軸の対立も同定されない。')
link('bita','boundary','proposal','bita','利用経路の観測から、何の機構まで言えるかを照合する候補。','現在は問いの接続。共同の機構同定器を実装した意味ではない。','proposed')
for a in ['sch','balance','slk','bita','payoff']:
    link('iwe',a,'comparison','iwe','同調の繁殖効果を、対立・構造・時間応答の外部経験的文脈として読む。','IWEは独立のメタ解析。L/R/K/Phiや機構配分を推定・検証しない。')
link('Structural','eog','provenance','Structural','EOGから分離した参照十分性の研究。両立世界の予測とは仕事を分ける。','EOG-WFと経験的分母を混ぜない。共有用語は再現の本数ではない。')
link('Structural','egwe','comparison','Structural','明示した参照・現在状態のあとに残る、端点関連の情報を問う。','within-system adequacyと未来状態十分性は同じ検定ではない。')
link('Structural','TTF','handoff','Structural','系内十分性→作用過程間の可搬性→未見種への転移を別段階で渡す。','後段の計画。Structuralの確認的資格認定を通るまで発動しない。')
link('egwe','TTF','comparison','Structural','未来関連状態の十分性と、種をまたぐ転移可能性を対照する。','一方の支持・不支持は他方の検証結果に継承されない。')
link('sdmr','odsp','handoff','odsp','環境座標の選択と、その座標が表す多次元状態の厚み。','四章の読解順序。全系列の直結APIや一括実証は意味しない。')
link('odsp','eog','handoff','odsp','多次元支持状態から、可能・到達世界を問う側へ。','状態分布と歴史的真実を同一視しない。')
link('eog','acsp','handoff','odsp','許容された支持と、次に調査する候補地の関係。','候補パッチは占有確率・発見保証ではない。')
link('sdmr','284b','handoff','284b','役割に応じた推定器の答えを、共通の生物学的機会へ写す。','同じ推定器・背景域・尺度を全生物へ強制しない。')
link('eog','284b','handoff','284b','到達性など異なる答えを、外部の生物学的関係で照合する。','異なる推定対象の照合であり、もう一つのSDMではない。')
link('esdm','sdmr','proposal','esdm','出現予測の環境選択と、生態状態を生む過程モデルを比較する。','ESDMは開発ブランチ。優越性や結果の継承は未確認。','proposed')
link('esdm','odsp','proposal','esdm','潜在生態状態と、多次元の状態分布・投影損失を接続する候補。','単位・時間・状態区分を揃えるアダプターは別途必要。','proposed')
link('esdm','rec','proposal','esdm','生成モデルの観測過程と、記録入口の選択を照合する候補。','宣言した情報経路は識別の証明ではない。','proposed')
link('esdm','acsp','proposal','esdm','状態推定から調査候補への出口を設計する候補。','実装済みの統合製品ではなく、野外発見も保証しない。','proposed')
link('esdm','Structural','proposal','esdm','生成した状態を、強い参照に対する独立な増分検証へ置く候補。','共通の端点・支持域・未見単位を先に凍結する必要がある。','proposed')
link('ccoc','crest','handoff','ced','開かれた未来の下で失うと困る区別を、必要状態へ渡す。','表現の下限は、データが既にその区別を見たことを意味しない。')
link('mltr','crest','handoff','ced','構造の置換と履歴に依存する意味を、必要状態として残す。','宣言された置換関係での定理であり、歴史のデータ推定ではない。')
link('mrm','crest','handoff','mrm','見える現在が同じでも、未来応答の違う機構を潰さない。','機構候補の記憶と、機構候補の実測同定は別。')
link('crest','ced','handoff','ced','保持すべき区別と、いま報告を許す証拠を照合する。','必要な精細化は、それを獲得済みだという証拠ではない。')
link('boundary','ced','comparison','ced','観測で分けられる集合と、対象の報告可能性を対照する。','対象の解像度と機構分解能を混同しない。')
link('boundary','mrod','handoff','mrod','現在の機構曖昧さを、次の観測で分ける問題へ。','最良適合モデルを選ぶこととは別。測定候補の妥当性が必要。')
link('mrm','mrod','proposal','mrm','応答型を分けるプローブと、候補観測の価値を同じ契約へ。','署名・費用・結果分割の明示的アダプターが必要。','proposed')
link('ced','mrod','proposal','ced','対象の報告リスクと、機構を解く測定設計を照合する。','同じ目的関数だとは仮定しない。','proposed')
link('crest','egwe','comparison','egwe','粗い現在の要約が、未来関連の差異を落としていないか問う。','有限Markov閉合を自然系の状態十分性へ格上げしない。')
link('crest','theouni','comparison','theouni','必要状態・証拠・契約を、より広い研究の役割へ整理する。','研究プログラム自体を生態状態と同一視しない。')
link('ccoc','adaptive-gain','proposal','ccoc','未来の応答インターフェースと、その区別を測る費用を対照する。','表現下限と測定費用は異なる量。一般同値は主張しない。','proposed')
for a in ['mrod','payoff','balance']:
    link(a,'adaptive-gain','provenance','adaptive-gain','結果に応じて次の測定を変える有限決定構造を独立化した系譜。','元の生態モデルや科学的結論は元リポに残る。')
for a in ['rec','tnoa','boundary','mrod','pollipi','insepi']:
    link('v3',a,'design','v3','参照による精細化・入口での選択・意味付け・次観測を別操作として接続する。','同じ装置・未見場面での経験的閉合は各段階で別に必要。')
link('rec','tnoa','handoff','rec','記録に入る前の脱落と、入った後の意味の保存を分ける。','REC→TNOAの前向き同一系検証は未閉合。')
link('pollipi','insepi','comparison','v3','実際の観測記録と、観測系の故障を介入で調べる装置を並べる。','メッシュ判定は確認された訪花ではない。V13の物理結果は別。')
link('pollipi','shimahotarubukuro','proposal','pollipi','直接の花形態と、訪問画像を同じ個体・観測ブロックで結ぶ候補。','画像から送粉効果や成熟種子まで自動的にはつながらない。','proposed')
link('acsp','aza3','proposal','aza3','必要な系統・形質対比を、候補調査地の選定へ渡す候補。','候補地の提案は採集・野外実施の認可ではない。','proposed')
link('hotarubukuro','fcp','comparison','fcp','一つの種の花色地理と、種を反復単位にした花色分布を比較する。','同じ花色というだけで解析分母や効果を共有しない。')
link('fcp','chun','comparison','chun','空間の組織化と、進化時間での生成・反復を並べる。','現在のCHUNはCamellia。過去の別科解析を現行結果へ混ぜない。')
link('fcp','TTF','provenance','TTF','花色の経験的研究から、種をまたぐ転換構造の方法を分離した。','種内の空間構造があることは、共有地図の存在ではない。')
link('azami','EAzami','comparison','EAzami','現在の頭花形質と、進化時間の分化を独立に照合する。','現在の環境関連で歴史的な原因の不支持を救わない。')
link('EAzami','aza3','handoff','aza3','公開データで残る歴史の曖昧さを、将来の同一個体データへ渡す。','一次データは未導入。将来の結果でChapter2を遡及確認しない。')
link('chun','EAzami','comparison','chun','花色と頭花の、異なる系統・形質における進化時間の問い。','同一の歴史過程を実証した関係ではない。')
link('island','izu-core','comparison','shimahotarubukuro','広域の反復パターンと、定着後の条件付き応答を照合する。','種の到着・進化・相互作用応答は異なる過程。')
link('izu-core','shimahotarubukuro','handoff','shimahotarubukuro','連続性のある伊豆系で、実現した表現型を独立に測る。','Chapter3はChapter2の欠けた確認パネルではない。')
link('island','shimahotarubukuro','comparison','shimahotarubukuro','世界の島嶼パターンと、局所の直接形態を異なる解像度で読む。','形態分化から歴史的な送粉者消失を原因同定しない。')
link('egc','egwe','provenance','egc','状態分離の有限モデルから、未来を分ける組織化・余力へ。','共有論文でもコードと証拠台帳は独立に保持する。')
link('egwe','egwee','comparison','egwee','有限系の状態分離と、自然系の多層応答を照合する。','自然系の分離・一致の両方を残す。有限演算子の検証ではない。')
link('island','Structural','proposal','Structural','海で隔てられた系と、景観内で分断された系を対照する候補。','起源が同じだとは仮定しない。データと端点を揃える必要がある。','proposed')
link('island','egwee','proposal','egwee','島嶼の形質応答と、断片化した植物の多層応答を対照する候補。','島と断片化を一つの原因・一つのシンドロームにしない。','proposed')
link('bita','island','proposal','bita','花へのアクセスと、迂回利用を含む実現相互作用をつなぐ候補。','花の単純化が特定の送粉機構を意味するとは限らない。','proposed')
link('iwe','izu-core','proposal','iwe','季節的な出会いと、実現する相手群集の違いを比較する候補。','時間的同調と群集置換は同じ説明変数ではない。','proposed')
assert len(sources)==40 and set(roles)==set(sources)
assert set(sources)=={x for l in links for x in [l['from'],l['to']]}
assert len(links)==len({tuple(sorted([l['from'],l['to']])) for l in links})
data={'schema':'zuizui.horizontal.v1','checkedAt':'2026-09-24','inventory':{'owner':'zuizui0223','owner_total':41,'research_programmes':40,'new':['slk','esdm','iwe','Structural'],'renamed':{'eco-genetic-criticality':'egc','eco-genetic-warning-extensions':'egwe'},'scope':'All 40 research repositories: README/positioning-document role audit. Not a full code/proof/branch-outcome audit.'},'separateFromScientificContacts':True,'kinds':{'handoff':'受け渡す','comparison':'対照する','provenance':'系譜を辿る','design':'観測を組む','proposal':'これから結ぶ'},'sources':sources,'roles':roles,'links':links,'conflicts':[{'id':'architecture-ownership','sources':['payoff','slk','balance','bita'],'resolution':'PAYOFF README retains earlier BITA recovery ownership. Current SLK/BALANCE/BITA positioning takes precedence for current navigation; earlier source remains historical.'},{'id':'esdm-main-placeholder','sources':['esdm'],'resolution':'main README contains only title; current programme role taken from the explicitly pinned development branch, not represented as merged or empirically validated.'}]}
sources['Structural-origin']={'repo':'Structural','path':'README.md','blob':'865890c0aa017cae715b5c81d5dd93848f783e43','ref':'main','read_lines':[1,53],'url':'https://github.com/zuizui0223/Structural/blob/main/README.md'}
for l in links:
    if l['id'] in ['Structural--eog','island--Structural']:l['source']='Structural-origin'
(R/'horizontal-data.js').write_text('/* Source-backed reading relationships. Never causal edges or automatic validation. */\nwindow.ZUIZUI_HORIZONTAL='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
(R/'horizontal-audit.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
