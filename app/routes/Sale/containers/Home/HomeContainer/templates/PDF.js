import React from 'react';

import writtenNumber from 'written-number';

import moment from 'moment';

import { SALES_REF_NO_BASE } from 'vars';

import Layout from './Layout';

import FontMedium from './Roboto-Medium';
import FontRegular from './Roboto-Regular';

import intersperse from 'intersperse';

export default class PDF extends React.Component {
  render() {
    const { intl, business, n } = this.props;
    const { isFullyPaid, paid, total, balanceDue, sale } = n;

    const paymentDate = sale.payments.length
      ? Math.max(...sale.payments.map(p => p.dateCreated))
      : false;

    const g = Math.min(Math.max(0, sale.items.length - 3), 9);

    const Line_1 = intersperse(
      [
        intersperse(
          [
            business.address ? (
              <span className="s2_1">{business.address}</span>
            ) : null,
            business.postalCode ? (
              <span className="s2_1">{business.postalCode}</span>
            ) : null,
            business.city ? <span className="s2_1">{business.city}</span> : null,
          ],
          <span>, </span>,
        ),
        business.ice ? <span className="s2_1">ICE : {business.ice}</span> : null,
        business.rc ? <span className="s2_1">RC : {business.rc}</span> : null,
        business.patente ? (
          <span className="s2_1">Patente : {business.patente}</span>
        ) : null,
        business.cnss ? (
          <span className="s2_1">CNSS : {business.cnss}</span>
        ) : null,
      ],
      <span> · </span>,
    );

    const Line_2 = intersperse(
      [
        business.phone ? (
          <span className="s2_1">Tél : {business.phone}</span>
        ) : null,
        business.fax ? <span className="s2_1">Fax : {business.fax}</span> : null,
        business.email ? (
          <span className="s2_1">E-mail : {business.email}</span>
        ) : null,
        business.url ? <span className="s2_1">Web : {business.url}</span> : null,
      ],
      <span> · </span>,
    );

    function formatDate(d) {
      return intl.formatDate(d, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          {STYLE_1}
          {STYLE_2}
          {STYLE_3}
        </head>
        <body style={{ margin: 0, WebkitPrintColorAdjust: 'exact' }}>
          <div
            id="p1"
            style={{
              margin: '0 auto 0',
              overflow: 'hidden',
              position: 'relative',
              width: 935,
              height: 1540,
            }}
          >
            <div
              id="pg1Overlay"
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor: 'rgba(0,0,0,0)',
                WebkitUserSelect: 'none',
              }}
            />
            <Layout
              paid={!!paid}
              g={g}
              h={business.displayName.toUpperCase().length}
            />
            <div id="t1_1" className="t s1_1">
              Adressé à:
            </div>
            <div id="t3_1" className="t s1_1">
              Adresse:
            </div>
            <div id="t5_1" className="t s1_1">
              Tél:
            </div>
            <div id="t6_1" className="t s2_1">
              {sale.client.displayName}
            </div>
            <div id="t8_1" className="t s2_1">
              {sale.client.address || <span>&mdash;</span>}
            </div>
            <div id="ta_1" className="t s2_1">
              {sale.client.tel || <span>&mdash;</span>}
            </div>
            <div id="tb_1" className="t s3_1">
              PRODUIT
            </div>
            <div id="tc_1" className="t s3_1">
              QTÉ
            </div>
            <div id="td_1" className="t s3_1">
              P. U.
            </div>
            <div id="tf_1" className="t s3_1">
              MONTANT
            </div>
            {sale.items.map(({ product, qty, unitPrice }, i) => {
              return [
                <div style={{ top: 432 + 32 * i }} id="tg" className="t s2_1">
                  {product.displayName}
                </div>,
                <div style={{ top: 432 + 32 * i }} id="th" className="t s1_1">
                  {qty}
                </div>,
                <div style={{ top: 432 + 32 * i }} id="ti" className="t s1_1">
                  {intl.formatNumber(unitPrice, { format: 'MAD' })}
                </div>,
                <div
                  style={{ top: 432 + 32 * i, left: 786 }}
                  id="tk"
                  className="t s1_1"
                >
                  {intl.formatNumber(unitPrice * qty, { format: 'MAD' })}
                </div>,
              ];
            })}
            <div style={{ top: 553 + 32 * g }} id="tq_1" className="t s1_1">
              Mode de paiement:
            </div>
            <div style={{ top: 584 + 32 * g }} id="tr_1" className="t s1_1">
              Nº:
            </div>
            <div style={{ top: 616 + 32 * g }} id="ts_1" className="t s1_1">
              Date de paiement:
            </div>
            <div style={{ top: 553 + 32 * g }} id="tt_1" className="t s2_1" />
            <div style={{ top: 616 + 32 * g }} id="tu_1" className="t s2_1">
              {paymentDate !== false ? (
                formatDate(moment.utc(paymentDate).toDate())
              ) : (
                <span>&mdash;</span>
              )}
            </div>
            <div style={{ top: 544 + g * 32 }} id="tv_1" className="t s1_1">
              Total TTC
            </div>
            <div
              style={{ top: 544 + g * 32, left: 786 }}
              id="tw_1"
              className="t s1_1"
            >
              {intl.formatNumber(total, { format: 'MAD' })}
            </div>
            {paid
              ? [
                  <div
                    style={{ top: 566 + g * 32 }}
                    id="tx_1"
                    className="t s1_1"
                  >
                    MONTANT REÇU
                  </div>,
                  <div
                    style={{ top: 566 + g * 32, left: 786 }}
                    id="ty_1"
                    className="t s1_1"
                  >
                    {intl.formatNumber(paid, { format: 'MAD' })}
                  </div>,
                ]
              : null}
            {isFullyPaid
              ? null
              : [
                  <div
                    style={{
                      top:
                        589 +
                        (paid ? 0 : 5) +
                        (paid ? g : Math.max(0, g - 1)) * 32,
                    }}
                    id="tz_1"
                    className="t s2_1"
                  >
                    SOLDE À PAYÉ
                  </div>,
                  <div
                    style={{
                      top:
                        589 +
                        (paid ? 0 : 5) +
                        (paid ? g : Math.max(0, g - 1)) * 32,
                      left: 786,
                    }}
                    id="t10_1"
                    className="t s1_1"
                  >
                    {intl.formatNumber(balanceDue, { format: 'MAD' })}
                  </div>,
                ]}
            {paid
              ? [
                  <div
                    style={{ top: 686 + 32 * g }}
                    id="t13_1"
                    className="t s1_1"
                  >
                    Arrête la présente facture à la somme de:
                  </div>,
                  <div
                    style={{ top: 686 + 32 * g }}
                    id="t14_1"
                    className="t s2_1"
                  >
                    {writtenNumber(paid, { lang: 'fr' }).toUpperCase()} DIRHAMS
                  </div>,
                ]
              : null}
            <div style={{ top: 756 + 32 * g }} id="t15_1" className="t s1_1">
              Cadre reservé à la société
            </div>
            <div id="t16_1" className="t s4_1">
              Facture
            </div>
            <div id="t17_1" className="t s1_1">
              Rabat le : {formatDate(new Date())}
            </div>
            <div id="t18_1" className="t s1_1">
              Numéro : {sale.refNo + SALES_REF_NO_BASE}
            </div>
            {/* <div id="t19_1" className="t s2_1"> */}
            {/*   {/* Epsilon SARL · CAPITAL 100 000 DHS */} */}
            {/*   {business.displayName} */}
            {/* </div> */}
            <div id="t1a_1" className="t s2_1">
              {/* {`3 Rue Jabel Tazeka, Agdal, 10100, Rabat · ICE : 987212 · RC : 98623 · Patente : 971920 · CNSS : 771893`} */}
              {Line_1}
            </div>
            <div id="t1b_1" className="t s2_1">
              {/* {`Tél : +212606759789 · Fax : +212376709700 · E-mail : rachid.boukhari@epsilon.ma · Web : www.epsilon.ma`} */}
              {Line_2}
            </div>
            {isFullyPaid ? (
              <div id="t1c_1" className="t m1_1 s5_1">
                PAYÉ
              </div>
            ) : null}
          </div>
        </body>
      </html>
    );
  }
}

const STYLE_1 = (
  <style
    className="shared-css"
    type="text/css"
    dangerouslySetInnerHTML={{
      __html: `
      .t {
        -webkit-transform-origin: top left;
        -moz-transform-origin: top left;
        -o-transform-origin: top left;
        -ms-transform-origin: top left;
        -webkit-transform: scale(0.25);
        -moz-transform: scale(0.25);
        -o-transform: scale(0.25);
        -ms-transform: scale(0.25);
        z-index: 2;
        position: absolute;
        white-space: pre;
        overflow: visible;
      }
  `,
    }}
  />
);

const STYLE_2 = (
  <style
    type="text/css"
    dangerouslySetInnerHTML={{
      __html: `
      #tg{left:99px;top:432px;}
      #th{left:318px;top:432px;word-spacing:-0.1px;}
      #ti{left:506px;top:432px;word-spacing:-0.1px;}
      #tk{left:810px;top:432px;}

      #t1_1{left:320px;top:164px;}
      #t2_1{left:320px;top:195px;}
      #t3_1{left:320px;top:226px;}
      #t4_1{left:320px;top:258px;}
      #t5_1{left:320px;top:289px;}
      #t6_1{left:435px;top:164px;}
      #t7_1{left:435px;top:195px;}
      #t8_1{left:435px;top:226px;word-spacing:0.1px;}
      #t9_1{left:435px;top:258px;}
      #ta_1{left:435px;top:289px;}
      #tb_1{left:99px;top:401px;}
      #tc_1{left:318px;top:401px;}
      #td_1{left:506px;top:401px;}
      #te_1{left:694px;top:401px;}
      #tf_1{left:786px;top:401px;}
      #tg_1{left:99px;top:432px;}
      #th_1{left:318px;top:432px;word-spacing:-0.1px;}
      #ti_1{left:506px;top:432px;word-spacing:-0.1px;}
      #tj_1{left:694px;top:432px;}
      #tk_1{left:810px;top:432px;}
      #tl_1{left:99px;top:464px;}
      #tm_1{left:318px;top:464px;word-spacing:-0.1px;}
      #tn_1{left:506px;top:464px;word-spacing:-0.1px;}
      #to_1{left:694px;top:464px;}
      #tp_1{left:794px;top:464px;}
      #tq_1{left:76px;top:553px;}
      #tr_1{left:76px;top:584px;}
      #ts_1{left:76px;top:616px;}
      #tt_1{left:229px;top:553px;}
      #tu_1{left:229px;top:616px;}
      #tv_1{left:633px;top:544px;}
      #tw_1{left:814px;top:544px;word-spacing:-0.1px;}
      #tx_1{left:633px;top:566px;}
      #ty_1{left:816px;top:566px;}
      #tz_1{left:633px;top:589px;}
      #t10_1{left:815px;top:589px;word-spacing:-0.1px;}
      #t11_1{left:633px;top:611px;}
      #t12_1{left:813px;top:611px;}
      #t13_1{left:198px;top:686px;}
      #t14_1{left:527px;top:686px;}
      #t15_1{left:453px;top:756px;word-spacing:-0.1px;}
      #t16_1{left:688px;top:35px;}
      #t17_1{left:709px;top:91px;}
      #t18_1{left:741px;top:109px;}
      #t19_1{left:345px;top:1455px;}
      #t1a_1{left:168px;top:1481px;}
      #t1b_1{left:154px;top:1504px;}
      #t1c_1{left:-252px;top:1176px;}
      .s1_1{
        FONT-SIZE: 55px;
        FONT-FAMILY: Roboto-Regular_b;
        color: rgb(0,0,0);
      }
      .s2_1{
        FONT-SIZE: 55px;
        FONT-FAMILY: Roboto-Medium_c;
        color: rgb(0,0,0);
      }
      .s3_1{
        FONT-SIZE: 55px;
        FONT-FAMILY: Roboto-Regular_b;
        color: rgb(22,156,238);
      }
      .s4_1{
        FONT-SIZE: 183.3px;
        FONT-FAMILY: Roboto-Medium_c;
        color: rgb(0,0,0);
      }
      .s5_1{
        FONT-SIZE: 2294.7px;
        FONT-FAMILY: Roboto-Medium_c;
        color: rgba(169, 169, 169, 0.3);
      }
      .t.m1_1{
        transform: matrix(0.52,-0.85,0.85,0.52,0, 0) scale(0.25);
      }
  `,
    }}
  />
);

const STYLE_3 = (
  <style
    id="fonts1"
    type="text/css"
    dangerouslySetInnerHTML={{
      __html: `
        @font-face {
          font-family: Roboto-Medium_c;
          src: url("${FontMedium}") format("woff");
        }
        @font-face {
          font-family: Roboto-Regular_b;
          src: url("${FontRegular}") format("woff");
        }
  `,
    }}
  />
);
